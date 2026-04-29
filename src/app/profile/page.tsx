"use client";

import { ProfileDetail } from "@/component/profile-detail";
import { UserQuizSection } from "@/component/user-quiz-section";
import { useUser } from "@/providers/user.provider";

export default function ProfilePage() {
    const {user, loading} = useUser();
    
    return (
        <div className="flex flex-row mr-50 ml-50 mt-14 gap-4">
            <ProfileDetail user={user} />
            <UserQuizSection user={user} />
        </div>
    )
}