import ProtectedRoute from "../../components/protectedRoute";
import DashboardComp from "../../components/user/dashboardComp";
import Layout from "../../Layout/layout";

export const Dashboard = ()=>{
    return (
        <Layout>
            <DashboardComp/>
        </Layout>
    )
}