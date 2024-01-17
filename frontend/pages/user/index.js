import Layout from "../../components/Layout";
import Private from '../../components/auth/Private';

function UserIndex(props) {
    return (
        <Layout>
            <Private>
                User Dashboard
            </Private>
        </Layout>
    );
}

export default UserIndex;