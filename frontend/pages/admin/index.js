import Layout from "../../components/Layout";
import Admin from "../../components/auth/Admin";

function AdminIndex(props) {
    return (
        <Layout>
            <Admin>
                Admin Dashboard
            </Admin>
        </Layout>
    );
}

export default AdminIndex;