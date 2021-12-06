import Header from '@components/layouts/Header';
import Footer from '@components/layouts/Footer';

const Layout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default Layout;
