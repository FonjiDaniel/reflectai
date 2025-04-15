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
        <div className="p-4  rounded-lg text-brand flex flex-col gap-4 max-sm:gap-2">
            <p className="text-lg font-semibold">Writing Streak</p>
            <p className="">Current Streak! You are on a <strong>{streak[0]?.current_streak ? streak[0]?.current_streak : 0}-day streak</strong>!</p>
            <p className="">{`Longest Streak: ${streak && streak[0]?.longest_streak} day${streak && streak[0]?.longest_streak > 1 ? "s" : ""}`}</p>

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