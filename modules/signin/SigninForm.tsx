import { signInWithKeycloak } from "./actions";
import { Button } from "@/components/ui/button";

const SigninForm = () => {
    return (
        <form 
            action={signInWithKeycloak}
            className="space-y-6 p-4"
        >
            <Button type="submit" className="w-full">
                Đăng nhập với Keycloak
            </Button>
        </form>
    )
}

export default SigninForm;