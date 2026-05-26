import { useAuthStore } from "@/modules/auth/stores/useAuthStore"

function DashboardPage(){
    const {user} = useAuthStore();
    return(
        <h1>Hello {user?.firstName}</h1>
    )
}

export default DashboardPage