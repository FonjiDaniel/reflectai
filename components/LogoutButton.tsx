"use client"
import { useAuthStore } from "@/store/useAuthStore"
import { useAuth } from "@clerk/nextjs"
import { Button } from "./ui/button";

function LogoutButton() {

    const { logout } = useAuthStore();
    const { signOut } = useAuth();

    const handleLogout = () => {
        try {
            logout();

            signOut();

        } catch (er) {
            console.log(er);
        }

    }
    return (
        <div>
            <Button onClick={handleLogout} />

        </div>
    )
}

export default LogoutButton
