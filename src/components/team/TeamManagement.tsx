import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Mail, Calendar, Shield, ExternalLink, X } from 'lucide-react';
import { UserProfile } from '../../types';
import { formatDate, cn } from '../../lib/utils';

interface TeamManagementProps {
  members: UserProfile[];
  loading: boolean;
}

export default function TeamManagement({ members, loading }: TeamManagementProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">User Management</h3>
          <p className="text-sm text-slate-500">View and track all users registered in your business.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((member) => (
                <tr key={member.uid} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {member.displayName.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-800">{member.displayName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3 h-3 text-slate-300" />
                      <span>{member.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3 text-slate-300" />
                      <span>{formatDate(member.joinedAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight",
                      member.role === 'admin' ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-600"
                    )}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {members.length === 0 && (
            <div className="py-20 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No team members found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
