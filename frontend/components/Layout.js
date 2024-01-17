import dynamic from 'next/dynamic'

const Header = dynamic(() => import('./Header'), { ssr: false })

function Layout({children}) {
    return (
        <>
            <Header />
            {children}
            {/* <p>Footer</p> */}
        </>
    );
}

export default Layout;