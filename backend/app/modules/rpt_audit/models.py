import datetime
from typing import List, Optional
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, Table, Column
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class Engagement(Base):
    """
    Engagement Model for Related Party Transactions Audit.
    All records are strictly scoped using tenant_id.
    """
    __tablename__ = "rpt_engagements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tenant_id: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    audit_name: Mapped[str] = mapped_column(String(255), nullable=False)
    entity: Mapped[str] = mapped_column(String(255), nullable=False)
    financial_year: Mapped[str] = mapped_column(String(10), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="Planning")  # e.g., Planning, Active, Review, Completed
    created_by: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    checklists: Mapped[List["Checklist"]] = relationship(
        "Checklist", back_populates="engagement", cascade="all, delete-orphan"
    )
    observations: Mapped[List["Observation"]] = relationship(
        "Observation", back_populates="engagement", cascade="all, delete-orphan"
    )


class Checklist(Base):
    """
    Checklist Model representing each of the 25 required RPT audit checks.
    """
    __tablename__ = "rpt_checklists"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    engagement_id: Mapped[int] = mapped_column(Integer, ForeignKey("rpt_engagements.id", ondelete="CASCADE"), nullable=False)
    step_number: Mapped[int] = mapped_column(Integer, nullable=False)
    step_name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="Pending")  # Pass, Fail, NA, Pending
    remarks: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    reviewer_comments: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    completed_by: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    completed_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, nullable=True)

    # Relationships
    engagement: Mapped["Engagement"] = relationship("Engagement", back_populates="checklists")
    evidences: Mapped[List["Evidence"]] = relationship(
        "Evidence", back_populates="checklist", cascade="all, delete-orphan"
    )


class Evidence(Base):
    """
    Evidence Model storing metadata for files uploaded to support audit findings.
    """
    __tablename__ = "rpt_evidences"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    checklist_id: Mapped[int] = mapped_column(Integer, ForeignKey("rpt_checklists.id", ondelete="CASCADE"), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)
    uploaded_by: Mapped[str] = mapped_column(String(100), nullable=False)
    uploaded_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    checklist: Mapped["Checklist"] = relationship("Checklist", back_populates="evidences")


class Observation(Base):
    """
    Observation Model capture RPT audit findings, risk ratings, and management recommendations.
    """
    __tablename__ = "rpt_observations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    engagement_id: Mapped[int] = mapped_column(Integer, ForeignKey("rpt_engagements.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    risk_level: Mapped[str] = mapped_column(String(20), nullable=False)  # High, Medium, Low
    root_cause: Mapped[str] = mapped_column(Text, nullable=False)
    recommendation: Mapped[str] = mapped_column(Text, nullable=False)
    owner: Mapped[str] = mapped_column(String(100), nullable=False)
    due_date: Mapped[datetime.date] = mapped_column(DateTime, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="Open")  # Open, In Progress, Resolved, Closed

    # Relationships
    engagement: Mapped["Engagement"] = relationship("Engagement", back_populates="observations")
    actions: Mapped[List["ActionTracker"]] = relationship(
        "ActionTracker", back_populates="observation", cascade="all, delete-orphan"
    )


class ActionTracker(Base):
    """
    ActionTracker Model for remediation tracking of audit observations.
    """
    __tablename__ = "rpt_actions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    observation_id: Mapped[int] = mapped_column(Integer, ForeignKey("rpt_observations.id", ondelete="CASCADE"), nullable=False)
    action: Mapped[str] = mapped_column(Text, nullable=False)
    owner: Mapped[str] = mapped_column(String(100), nullable=False)
    target_date: Mapped[datetime.date] = mapped_column(DateTime, nullable=False)
    completion_date: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="Open")  # Open, In Progress, Completed

    # Relationships
    observation: Mapped["Observation"] = relationship("Observation", back_populates="actions")
