import logo from "../../assets/grehasoft-logo.png";

const LoginHeader = () => {
  return (
    <div className="text-center mb-4">
      <img src={logo} alt="Grehasoft" height={60} />
      <h4 className="mt-3 fw-bold">Grehasoft PMS</h4>
    </div>
  );
};

export default LoginHeader;
