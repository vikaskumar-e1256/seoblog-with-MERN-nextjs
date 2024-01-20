import Layout from "../../components/Layout";
import Admin from "../../components/auth/Admin";
import Link from 'next/link';

function AdminIndex(props) {
    return (
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Admin Dashboard</h2>
                        </div>
                        <div className="col-md-4">
                            <ul class="list-group">
                                <li className="list-group-item">
                                    <Link href="/admin/crud/category-tag">
                                        <span>Create Category</span>
                                    </Link>
                                </li>

                                <li className="list-group-item">
                                    <Link href="/admin/crud/category-tag">
                                        <span>Create Tag</span>
                                    </Link>
                                </li>

                                <li className="list-group-item">
                                    <Link href="/admin/crud/blog">
                                        <span>Create Blog</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-8">right</div>
                    </div>
                </div>
            </Admin>
        </Layout>
    );
}

export default AdminIndex;