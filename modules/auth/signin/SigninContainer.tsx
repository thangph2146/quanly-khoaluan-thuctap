import SigninForm from "./SigninForm";

const SigninContainer = () => {
    return ( <div className="max-w-sm mx-auto mt-16 animate-fade-in">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2 text-center">Chào mừng bạn đến với Hệ thống Quản lý</h2>
            <p className="text-gray-500 mb-6 text-center">Vui lòng đăng nhập để tiếp tục sử dụng các chức năng quản trị.</p>
            <SigninForm />
        </div>
    </div>
    );
};

export default SigninContainer;