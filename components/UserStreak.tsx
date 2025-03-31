import { getUserStreak } from "@/lib/actions/library";
import React, { useEffect, useState } from "react";
import { UserStreak } from "@/types/index";

const UserStreakComponent = ({ userId, token }: { userId: string, token: string }) => {

    const [streak, setStreak] = useState<UserStreak[]>([]);

    useEffect(() => {

        const getStreak = async () => {
            setStreak(await getUserStreak(userId, token))

        }
        getStreak();


    }, [userId, token])


    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">🔥 Writing Streak</h2>
            <p className="text-gray-600">You rock! You are on a <strong>{streak[0]?.current_streak}-day streak</strong>!</p>
            <p className="text-gray-500">Longest Streak: {streak && streak[0]?.longest_streak} days</p>


            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                    <h3 className="text-xl font-semibold">🔥 {streak[0]?.current_streak} Day Streak</h3>
                </div>
                <p className="text-gray-500">Longest Streak: {streak[0]?.longest_streak} days</p>
            </div>



            <div className="flex items-center gap-1">
                {[...Array(7)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-6 h-6 rounded-full ${i < streak[0]?.current_streak ? "bg-green-500" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>

        </div>
    );



}
export default UserStreakComponent;