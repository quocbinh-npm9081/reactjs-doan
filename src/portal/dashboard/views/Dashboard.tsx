import Invitations from '@/portal/invitations/views/Invitations/Invitations'
import { ProtectOutletPrivileges } from '@/portal/routes/ProtectOutlet/ProtectOutlet'
import { useAuth } from '@/store/auth/useAuth'
import { Privilege } from '@/types/user/userEnum'

export default function DashboardPage() {
  const user = useAuth()
  return (
    <div style={{ height: '90%' }}>
      <h1 style={{ fontWeight: 500 }}>
        Welcome back <strong>{user?.firstName}</strong>!
      </h1>
      <ProtectOutletPrivileges privileges={[Privilege.VIEW_MY_INVITATION]}>
        <Invitations />
      </ProtectOutletPrivileges>
    </div>
  )
}
