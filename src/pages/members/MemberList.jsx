import { useState, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  BookOpen,
  IdCard
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useMembers } from '../../context/MemberContext'
import { useIssueReturn } from '../../context/IssueReturnContext'
import Modal from '../../components/common/Modal'
import EmptyState from '../../components/common/EmptyState'
import Badge from '../../components/common/Badge'

export default function MemberList() {
  const { members, addMember, editMember, deleteMember } = useMembers()
  const { issues } = useIssueReturn()

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [viewingProfile, setViewingProfile] = useState(null)
  const [deletingMember, setDeletingMember] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    if (editingMember) {
      setValue('fullName', editingMember.fullName)
      setValue('email', editingMember.email)
      setValue('mobileNumber', editingMember.mobileNumber)
      setValue('address', editingMember.address)
      setValue('membershipId', editingMember.membershipId)
      setValue('membershipDate', editingMember.membershipDate)
      setValue('status', editingMember.status)
    } else {
      reset({
        fullName: '',
        email: '',
        mobileNumber: '',
        address: '',
        membershipId: '',
        membershipDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      })
    }
  }, [editingMember, reset, setValue])

  // Filter members by search term
  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return members
    const q = searchTerm.toLowerCase()
    return members.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.membershipId.toLowerCase().includes(q) ||
        m.mobileNumber.toLowerCase().includes(q)
    )
  }, [members, searchTerm])

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage) || 1
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredMembers.slice(start, start + itemsPerPage)
  }, [filteredMembers, currentPage, itemsPerPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Submit Add / Edit Form
  const onFormSubmit = (data) => {
    try {
      if (editingMember) {
        editMember(editingMember.id, data)
        toast.success(`Member record for "${data.fullName}" updated!`)
        setEditingMember(null)
      } else {
        addMember(data)
        toast.success(`New member "${data.fullName}" registered!`)
        setIsAddModalOpen(false)
      }
      reset()
    } catch (err) {
      toast.error(err.message || 'Operation failed')
    }
  }

  // Confirm delete
  const confirmDelete = () => {
    if (deletingMember) {
      deleteMember(deletingMember.id)
      toast.success(`Member "${deletingMember.fullName}" deleted.`)
      setDeletingMember(null)
    }
  }

  // Active issues for viewing profile
  const memberActiveIssues = useMemo(() => {
    if (!viewingProfile) return []
    return issues.filter((i) => i.memberId === viewingProfile.id)
  }, [viewingProfile, issues])

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Member Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Register, view profiles, and manage patron memberships & loan history
          </p>
        </div>
        <button
          onClick={() => {
            setEditingMember(null)
            setIsAddModalOpen(true)
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 rounded-xl shadow-sm shadow-teal-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add Member
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or Membership ID..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="text-xs text-slate-500">
          Total Members: <span className="font-bold text-slate-800">{members.length}</span>
        </div>
      </div>

      {/* Members Table */}
      {filteredMembers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No members found"
          description="Try modifying your search or enroll a new member."
          actionLabel="Add Member"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Member</th>
                  <th className="py-3.5 px-5">Membership ID</th>
                  <th className="py-3.5 px-5">Contact Details</th>
                  <th className="py-3.5 px-5">Joined Date</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {member.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{member.fullName}</div>
                          <div className="text-slate-400 text-[11px] truncate max-w-xs">{member.address}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 font-mono font-medium text-slate-700">
                      {member.membershipId}
                    </td>

                    <td className="py-4 px-5 space-y-1">
                      <div className="text-slate-700 flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{member.email}</span>
                      </div>
                      <div className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{member.mobileNumber}</span>
                      </div>
                    </td>

                    <td className="py-4 px-5 text-slate-600">
                      {member.membershipDate}
                    </td>

                    <td className="py-4 px-5">
                      <Badge status={member.status} />
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingProfile(member)}
                          className="p-1.5 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingMember(member)}
                          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                          title="Edit Member"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingMember(member)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-xs">
              <span className="text-slate-500">
                Page <span className="font-semibold text-slate-800">{currentPage}</span> of{' '}
                <span className="font-semibold text-slate-800">{totalPages}</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Member Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingMember}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingMember(null)
        }}
        title={editingMember ? 'Edit Member Information' : 'Register New Member'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              {...register('fullName', { required: 'Full name is required' })}
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
                })}
                placeholder="john.doe@example.com"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
              <input
                type="tel"
                {...register('mobileNumber', { required: 'Mobile number is required' })}
                placeholder="+1 555-019-2834"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              {errors.mobileNumber && <p className="text-xs text-rose-500 mt-1">{errors.mobileNumber.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Membership ID</label>
              <input
                type="text"
                {...register('membershipId')}
                placeholder="Auto-generated if blank"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address *</label>
            <textarea
              rows={2}
              {...register('address', { required: 'Address is required' })}
              placeholder="Full street address, city, state"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false)
                setEditingMember(null)
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition shadow-sm active:scale-95"
            >
              {editingMember ? 'Save Changes' : 'Register Member'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Member Profile View Modal */}
      <Modal
        isOpen={!!viewingProfile}
        onClose={() => setViewingProfile(null)}
        title="Member Profile Overview"
        maxWidth="max-w-xl"
      >
        {viewingProfile && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-teal-600/20">
                {viewingProfile.fullName.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{viewingProfile.fullName}</h3>
                  <Badge status={viewingProfile.status} />
                </div>
                <div className="text-xs font-mono text-teal-600 font-semibold">
                  {viewingProfile.membershipId}
                </div>
                <div className="text-xs text-slate-400">
                  Member since {viewingProfile.membershipDate}
                </div>
              </div>
            </div>

            {/* Contact details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <span className="text-slate-400 block mb-0.5">Email Address</span>
                <span className="font-semibold text-slate-800">{viewingProfile.email}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <span className="text-slate-400 block mb-0.5">Phone Number</span>
                <span className="font-semibold text-slate-800">{viewingProfile.mobileNumber}</span>
              </div>
              <div className="sm:col-span-2 p-3 bg-white rounded-xl border border-slate-200/80">
                <span className="text-slate-400 block mb-0.5">Address</span>
                <span className="font-semibold text-slate-800">{viewingProfile.address}</span>
              </div>
            </div>

            {/* Loan records */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Active & Past Loans ({memberActiveIssues.length})
              </h4>
              {memberActiveIssues.length === 0 ? (
                <p className="text-xs text-slate-400 p-3 bg-slate-50 rounded-xl text-center">
                  No book loan records found for this member.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {memberActiveIssues.map((iss) => (
                    <div
                      key={iss.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{iss.bookTitle}</div>
                        <div className="text-[11px] text-slate-500">
                          Issued: {iss.issueDate} &bull; Due: {iss.dueDate}
                        </div>
                      </div>
                      <Badge status={iss.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingProfile(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Member Confirmation Modal */}
      <Modal
        isOpen={!!deletingMember}
        onClose={() => setDeletingMember(null)}
        title="Confirm Member Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-xs">
              Are you sure you want to delete member <span className="font-bold">"{deletingMember?.fullName}"</span>?
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDeletingMember(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-sm active:scale-95"
            >
              Delete Member
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
