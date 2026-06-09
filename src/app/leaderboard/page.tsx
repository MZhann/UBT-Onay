"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { getMyLeaderboardInfo } from "@/api/leaderboard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import Skeleton from "@/components/ui/skeleton";

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  total_score: number;
}

interface LeaderboardResponse {
  users: User[];
  users_count: number;
}

const PAGE_SIZE = 5; // Number of users per page

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rank, setRank] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [totalUsersCount, setTotalUsersCount] = useState<number | null>(null);

  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

  useEffect(() => {
    fetchLeaderboard();
  }, [page]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMyLeaderboardInfo();
      setRank(data.rank);
      setTotalScore(data.total_score);
      setTotalUsersCount(data.users_count);
    };
    fetchData();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get<LeaderboardResponse>(
        `https://untcs-production.up.railway.app/api/v1/profile/leaderboard?skip=${
          page * PAGE_SIZE
        }&limit=${PAGE_SIZE}`
      );
      setUsers(response.data.users);
      setTotalUsers(response.data.users_count);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full px-20">
      <div className="w-full flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>

        <div className="flex flex-col items-center mb-4">
          <p className="text-lg">
            Total users:{" "}
            <span className="font-bold text-xl text-indigo-500">
              {totalUsersCount}
            </span>
          </p>
          <p className="text-lg">
            Your place:{" "}
            <span className="font-bold text-xl text-indigo-500">{rank}</span>
          </p>
          <p className="text-lg">
            Your score:{" "}
            <span className="font-bold text-xl text-indigo-500">
              {totalScore}
            </span>
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2 justify-center">
          {/* <Loader2 className="animate-spin w-6 h-6" /> */}
          <Skeleton className="w-full h-[4.5rem]" />
          <Skeleton className="w-full h-[4.5rem]" />
          <Skeleton className="w-full h-[4.5rem]" />
          <Skeleton className="w-full h-[4.5rem]" />
          <Skeleton className="w-full h-[4.5rem]" />
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((user, index) => {
            
            const overallRank = page * PAGE_SIZE + index + 1; // Calculate overall rank based on pagination
            return (
              <Card
                key={user._id}
                className="flex items-center justify-between p-4 bg-blue-900 text-white rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">
                    {page * PAGE_SIZE + index + 1}
                  </span>
                  <div className="w-10 h-10 rounded-full">
                    {overallRank == 1 && <p className="text-4xl">🥇</p>}
                    {overallRank == 2 && <p className="text-4xl">🥈</p>}
                    {overallRank == 3 && <p className="text-4xl">🥉</p>}
                    {overallRank > 3 && <p className="text-4xl">🏅</p>}
                  </div>
                  <span>
                    {user.first_name} {user.last_name}
                  </span>
                </div>
                <span>{user.total_score} points</span>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <Pagination className="mt-6">
        <PaginationContent>
          {/* Previous button */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              className={page === 0 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* Page numbers */}
          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                isActive={i === page}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Next button */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                setPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              className={
                page === totalPages - 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
