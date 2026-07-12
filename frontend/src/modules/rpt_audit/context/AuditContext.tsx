import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { 
  Tenant, 
  Engagement, 
  Checklist, 
  Observation, 
  ActionTracker, 
  DashboardData, 
  ReportData 
} from "../types";

interface AuditContextType {
  tenants: Tenant[];
  activeTenant: Tenant;
  changeTenant: (id: string) => void;
  activeRole: string; // "Super Admin" | "Tenant Admin" | "Auditor"
  changeRole: (role: string) => void;
  
  engagements: Engagement[];
  selectedEngagementId: number | null;
  selectedEngagement: Engagement | null;
  setSelectedEngagementId: (id: number | null) => void;
  
  checklist: Checklist[];
  observations: Observation[];
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;

  // API triggers
  refreshAll: () => Promise<void>;
  createEngagement: (name: string, entity: string, fy: string) => Promise<Engagement | null>;
  updateEngagementStatus: (id: number, status: string) => Promise<void>;
  deleteEngagement: (id: number) => Promise<void>;
  updateChecklistItem: (id: number, data: Partial<Checklist>) => Promise<void>;
  uploadEvidence: (checklistId: number, fileName: string) => Promise<void>;
  createObservation: (data: Omit<Observation, "id" | "status" | "actions">) => Promise<Observation | null>;
  updateObservation: (id: number, data: Partial<Observation>) => Promise<void>;
  deleteObservation: (id: number) => Promise<void>;
  createAction: (obsId: number, action: string, owner: string, targetDate: string) => Promise<void>;
  updateActionItem: (id: number, data: Partial<ActionTracker>) => Promise<void>;
  getReport: (engagementId: number) => Promise<ReportData | null>;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error("useAudit must be used within an AuditProvider");
  }
  return context;
};

export const AuditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>([
    { id: "acme", name: "Acme Corporation" },
    { id: "globaltech", name: "Global Tech Inc" },
    { id: "alphafinance", name: "Alpha Financial Services" }
  ]);
  const [activeTenant, setActiveTenant] = useState<Tenant>({ id: "acme", name: "Acme Corporation" });
  const [activeRole, setActiveRole] = useState<string>("Tenant Admin");

  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [selectedEngagementId, setSelectedEngagementId] = useState<number | null>(null);
  const [checklist, setChecklist] = useState<Checklist[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Computed selected engagement
  const selectedEngagement = engagements.find(e => e.id === selectedEngagementId) || null;

  // Custom headers with multi-tenant X-Tenant-ID
  const getHeaders = useCallback(() => {
    return {
      "Content-Type": "application/json",
      "X-Tenant-ID": activeTenant.id
    };
  }, [activeTenant.id]);

  // Main Fetch Core
  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Engagements
      const engRes = await fetch(`/api/engagements`, { headers: getHeaders() });
      if (!engRes.ok) throw new Error("Failed to fetch engagements.");
      const engData: Engagement[] = await engRes.json();
      setEngagements(engData);

      // Auto-select first engagement if none selected
      if (engData.length > 0) {
        if (!selectedEngagementId || !engData.find(e => e.id === selectedEngagementId)) {
          setSelectedEngagementId(engData[0].id);
        }
      } else {
        setSelectedEngagementId(null);
      }

      // 2. Fetch Observations
      const obsRes = await fetch(`/api/observations`, { headers: getHeaders() });
      if (!obsRes.ok) throw new Error("Failed to fetch observations.");
      const obsData: Observation[] = await obsRes.json();
      setObservations(obsData);

      // 3. Fetch Dashboard Stats
      const dbRes = await fetch(`/api/dashboard`, { headers: getHeaders() });
      if (!dbRes.ok) throw new Error("Failed to fetch dashboard data.");
      const dbData: DashboardData = await dbRes.json();
      setDashboardData(dbData);

    } catch (e: any) {
      console.error(e);
      setError(e.message || "An error occurred while synchronizing with the audit server.");
    } finally {
      setLoading(false);
    }
  }, [getHeaders, selectedEngagementId]);

  // Fetch checklist when selected engagement changes
  useEffect(() => {
    const fetchChecklist = async () => {
      if (!selectedEngagementId) {
        setChecklist([]);
        return;
      }
      try {
        const res = await fetch(`/api/checklist/${selectedEngagementId}`, { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          setChecklist(data);
        }
      } catch (e) {
        console.error("Failed to load checklist:", e);
      }
    };
    fetchChecklist();
  }, [selectedEngagementId, getHeaders]);

  // Trigger load on tenant change
  useEffect(() => {
    refreshAll();
  }, [activeTenant, refreshAll]);

  const changeTenant = (id: string) => {
    const target = tenants.find(t => t.id === id);
    if (target) {
      setActiveTenant(target);
      setSelectedEngagementId(null); // Reset selected engagement on tenant change
    }
  };

  const changeRole = (role: string) => {
    setActiveRole(role);
  };

  // CREATE Engagement
  const createEngagement = async (name: string, entity: string, fy: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/engagements`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          audit_name: name,
          entity,
          financial_year: fy,
          status: "Planning"
        })
      });
      if (!res.ok) throw new Error("Failed to create engagement.");
      const newEng = await res.json();
      await refreshAll();
      setSelectedEngagementId(newEng.id);
      return newEng;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE Engagement Status
  const updateEngagementStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/engagement/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update status.");
      await refreshAll();
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };

  // DELETE Engagement
  const deleteEngagement = async (id: number) => {
    try {
      const res = await fetch(`/api/engagement/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete engagement.");
      if (selectedEngagementId === id) {
        setSelectedEngagementId(null);
      }
      await refreshAll();
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };

  // UPDATE Checklist Item
  const updateChecklistItem = async (id: number, data: Partial<Checklist>) => {
    try {
      const res = await fetch(`/api/checklist/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          ...data,
          completed_by: activeRole
        })
      });
      if (!res.ok) throw new Error("Failed to update checklist item.");
      const updatedItem = await res.json();
      
      // Update local state checklist
      setChecklist(prev => prev.map(item => item.id === id ? updatedItem : item));
      
      // Refresh dashboard KPI charts
      const dbRes = await fetch(`/api/dashboard`, { headers: getHeaders() });
      if (dbRes.ok) {
        const dbData = await dbRes.json();
        setDashboardData(dbData);
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };

  // UPLOAD Evidence
  const uploadEvidence = async (checklistId: number, fileName: string) => {
    try {
      const res = await fetch(`/api/upload`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          checklist_id: checklistId,
          file_name: fileName
        })
      });
      if (!res.ok) throw new Error("Failed to upload evidence.");
      
      // Update checklist remark locally or refetch
      setChecklist(prev => prev.map(item => {
        if (item.id === checklistId) {
          const updatedRemarks = item.remarks 
            ? `${item.remarks}\n[Evidence Linked: ${fileName}]` 
            : `[Evidence Linked: ${fileName}]`;
          return { ...item, remarks: updatedRemarks };
        }
        return item;
      }));
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };

  // CREATE Observation
  const createObservation = async (data: Omit<Observation, "id" | "status" | "actions">) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/observations`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to log observation.");
      const newObs = await res.json();
      await refreshAll();
      return newObs;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE Observation
  const updateObservation = async (id: number, data: Partial<Observation>) => {
    try {
      const res = await fetch(`/api/observations/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to update finding.");
      await refreshAll();
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };

  // DELETE Observation
  const deleteObservation = async (id: number) => {
    try {
      const res = await fetch(`/api/observations/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete observation.");
      await refreshAll();
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };

  // CREATE Corrective Action
  const createAction = async (obsId: number, action: string, owner: string, targetDate: string) => {
    try {
      const res = await fetch(`/api/actions`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          observation_id: obsId,
          action,
          owner,
          target_date: targetDate
        })
      });
      if (!res.ok) throw new Error("Failed to add corrective action.");
      await refreshAll();
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };

  // UPDATE Action Item
  const updateActionItem = async (id: number, data: Partial<ActionTracker>) => {
    try {
      const res = await fetch(`/api/actions/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to update action tracker.");
      await refreshAll();
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };

  // GENERATE Comprehensive Audit Report
  const getReport = async (engagementId: number): Promise<ReportData | null> => {
    try {
      const res = await fetch(`/api/report?engagement_id=${engagementId}`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to generate report.");
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  return (
    <AuditContext.Provider
      value={{
        tenants,
        activeTenant,
        changeTenant,
        activeRole,
        changeRole,
        engagements,
        selectedEngagementId,
        selectedEngagement,
        setSelectedEngagementId,
        checklist,
        observations,
        dashboardData,
        loading,
        error,
        refreshAll,
        createEngagement,
        updateEngagementStatus,
        deleteEngagement,
        updateChecklistItem,
        uploadEvidence,
        createObservation,
        updateObservation,
        deleteObservation,
        createAction,
        updateActionItem,
        getReport
      }}
    >
      {children}
    </AuditContext.Provider>
  );
};
