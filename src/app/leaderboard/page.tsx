"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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

  useEffect(() => {
    fetchLeaderboard();
  }, [page]);

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
          <span className="text-lg">Total users: {totalUsers}</span>
          <span className="text-lg">Your place: —</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((user, index) => (
            <Card
              key={user._id}
              className="flex items-center justify-between p-4 bg-blue-900 text-white rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">
                  {page * PAGE_SIZE + index + 1}
                </span>
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <span>
                  {user.first_name} {user.last_name}
                </span>
              </div>
              <span>{user.total_score} points</span>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-4">
        <Button onClick={() => setPage(page - 1)} disabled={page === 0}>
          Previous
        </Button>
        <Button
          onClick={() => setPage(page + 1)}
          disabled={(page + 1) * PAGE_SIZE >= totalUsers}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
