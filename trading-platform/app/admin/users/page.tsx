"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, UserPlus, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "../../hooks/useAuth"

interface User {
  email: string
  balance: number
  status: string
  joinedAt: string
  lastLogin: string
  totalDeposits: number
  totalWithdrawals: number
  tradeCount: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const { getAllUsers } = useAuth()

  useEffect(() => {
    const fetchUsers = () => {
      const userArray = getAllUsers()
      setUsers(userArray)
    }

    fetchUsers()

    // Set up an interval to refresh the user list every 5 seconds
    const intervalId = setInterval(fetchUsers, 5000)

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [getAllUsers])

  const handleEdit = (user: User) => {
    setEditingUser(user)
  }

  const handleSave = () => {
    if (editingUser) {
      const updatedUsers = users.map((u) => (u.email === editingUser.email ? editingUser : u))
      setUsers(updatedUsers)
      const storedUsers = JSON.parse(localStorage.getItem("users") || "{}")
      storedUsers[editingUser.email] = {
        ...storedUsers[editingUser.email],
        balance: editingUser.balance,
        status: editingUser.status,
      }
      localStorage.setItem("users", JSON.stringify(storedUsers))
      setEditingUser(null)
    }
  }

  const handleDelete = (email: string) => {
    const updatedUsers = users.filter((u) => u.email !== email)
    setUsers(updatedUsers)
    const storedUsers = JSON.parse(localStorage.getItem("users") || "{}")
    delete storedUsers[email]
    localStorage.setItem("users", JSON.stringify(storedUsers))
  }

  const filteredUsers = users.filter((user) => user.email.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Accounts</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[300px] bg-white/10"
            />
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/10 border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${users.reduce((sum, user) => sum + user.balance, 0).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${users.reduce((sum, user) => sum + user.totalDeposits, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${users.reduce((sum, user) => sum + user.totalWithdrawals, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/10 border-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Balance</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Deposits</TableHead>
                <TableHead className="text-white">Withdrawals</TableHead>
                <TableHead className="text-white">Trades</TableHead>
                <TableHead className="text-white">Joined</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.email}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>${user.balance.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.status === "Active" ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${user.totalDeposits.toFixed(2)}</TableCell>
                  <TableCell>${user.totalWithdrawals.toFixed(2)}</TableCell>
                  <TableCell>{user.tradeCount}</TableCell>
                  <TableCell>{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(user)}>
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-900 text-white">
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                          <DialogDescription>
                            Make changes to the user's account details here. Click save when you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label>Email</label>
                            <Input value={editingUser?.email || ""} readOnly className="bg-zinc-800 text-white" />
                          </div>
                          <div className="space-y-2">
                            <label>Balance</label>
                            <Input
                              type="number"
                              value={editingUser?.balance || 0}
                              onChange={(e) =>
                                setEditingUser((prev) => prev && { ...prev, balance: Number(e.target.value) })
                              }
                              className="bg-zinc-800 text-white"
                            />
                          </div>
                        </div>
                        <Button onClick={handleSave} className="w-full mt-4">
                          Save Changes
                        </Button>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(user.email)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

