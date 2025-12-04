import Footer from "../components/footer.jsx";
import Header from "../components/header.jsx";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer/>
    </div>
  );
};

export default Layout;
