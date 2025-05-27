"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import useSWR, { mutate } from "swr";
const fetcher = (u: string) => fetch(u).then((r) => r.json());


type AdminUser = {
  id: string;
  role: "ADMIN";
  full_name: string;
  email: string;
  phone: string | null;
};

type SEUser = {
  id: string;
  role: "SE";
  full_name: string;
  email: string;
  phone: string | null;
  cost_rate: number | null;
  bill_rate: number | null;
};

type User = AdminUser | SEUser;

export default function UserManager() {
  const {
    data: users,
    isLoading,
    error,
  } = useSWR<User[]>("/api/admin/users", fetcher);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<"admin" | "se">("admin");
  const [activeTab, setActiveTab] = useState("admin");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    costRate: "",
    billRate: "",
  });

  if (isLoading) return <p>Loading…</p>;
  if (error || !users) return <p>Error loading users</p>;

  async function handleAddUser() {
    const payload = {
      p_role: userType.toUpperCase(),
      p_name: formData.name,
      p_email: formData.email,
      p_phone: formData.phone,
      p_cost_rate: userType === "se" ? Number(formData.costRate) : null,
      p_bill_rate: userType === "se" ? Number(formData.billRate) : null,
    };

    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    mutate("/api/admin/users");
    resetForm();
    setIsAddDialogOpen(false);
  }

  async function handleEditUser() {
    if (!selectedUser) return;
    const payload = {
      p_id: selectedUser.id,
      p_role: selectedUser.role,
      p_name: formData.name,
      p_email: formData.email,
      p_phone: formData.phone,
      p_cost_rate:
        selectedUser.role === "SE" ? Number(formData.costRate) : null,
      p_bill_rate:
        selectedUser.role === "SE" ? Number(formData.billRate) : null,
    };
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    mutate("/api/admin/users");
    resetForm();
    setIsEditDialogOpen(false);
  }

  async function handleDeleteUser() {
    if (!selectedUser) return;
    await fetch(`/api/admin/users?id=${selectedUser.id}`, { method: "DELETE" });
    mutate("/api/admin/users");
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      costRate: "",
      billRate: "",
    });
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.full_name,
      email: user.email,
      phone: user.phone ?? "",
      costRate:
        user.role === "SE" && user.cost_rate ? String(user.cost_rate) : "",
      billRate:
        user.role === "SE" && user.bill_rate ? String(user.bill_rate) : "",
    });
    setUserType(user.role === "ADMIN" ? "admin" : "se");
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const adminUsers = users.filter((u) => u.role === "ADMIN") as AdminUser[];
  const seUsers = users.filter((u) => u.role === "SE") as SEUser[];

  return (
    <Card className="bg-white">
      <CardContent>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            <div className="">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Manage Users</h2>
                <Button
                  onClick={() => {
                    resetForm();
                    setUserType(activeTab === "admin" ? "admin" : "se");
                    setIsAddDialogOpen(true);
                  }}
                  className="bg-[#141417] hover:bg-[#3b3b3b]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <ToggleGroup
                  type="single"
                  className="mb-6"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <ToggleGroupItem
                    value="admin"
                    className="rounded-2xl p-5 text-md"
                  >
                    Admin Users
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="se"
                    className="rounded-2xl p-5 text-md"
                  >
                    SE Users
                  </ToggleGroupItem>
                </ToggleGroup>

                <TabsContent value="admin">
                  <div className="bg-[#ffffff] rounded-lg border border-[#e5e7eb]">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#e5e7eb]">
                          <th className="text-left p-4 font-medium">Name</th>
                          <th className="text-left p-4 font-medium">Email</th>
                          <th className="text-left p-4 font-medium">Phone</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminUsers.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="text-center p-8 text-gray-500"
                            >
                              No admin users found
                            </td>
                          </tr>
                        ) : (
                          adminUsers.map((user) => (
                            <tr
                              key={user.id}
                              className="border-b border-[#e5e7eb] last:border-0"
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                                    <AvatarFallback>
                                      {user.full_name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{user.full_name}</span>
                                </div>
                              </td>
                              <td className="p-4">{user.email}</td>
                              <td className="p-4">{user.phone}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openEditDialog(user)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openDeleteDialog(user)}
                                    className="text-[#ce4343] hover:text-[#ce4343] hover:bg-[#ce4343]/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="se">
                  <div className="bg-[#ffffff] rounded-lg border border-[#e5e7eb]">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#e5e7eb]">
                          <th className="text-left p-4 font-medium">Name</th>
                          <th className="text-left p-4 font-medium">Email</th>
                          <th className="text-left p-4 font-medium">Phone</th>
                          <th className="text-left p-4 font-medium">
                            Cost Rate
                          </th>
                          <th className="text-left p-4 font-medium">
                            Bill Rate
                          </th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seUsers.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="text-center p-8 text-gray-500"
                            >
                              No SE users found
                            </td>
                          </tr>
                        ) : (
                          seUsers.map((user) => (
                            <tr
                              key={user.id}
                              className="border-b border-[#e5e7eb] last:border-0"
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                                    <AvatarFallback>
                                      {user.full_name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{user.full_name}</span>
                                </div>
                              </td>
                              <td className="p-4">{user.email}</td>
                              <td className="p-4">{user.phone}</td>
                              <td className="p-4">${user.cost_rate ?? 0}/hr</td>
                              <td className="p-4">${user.bill_rate ?? 0}/hr</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openEditDialog(user)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openDeleteDialog(user)}
                                    className="text-[#ce4343] hover:text-[#ce4343] hover:bg-[#ce4343]/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <Dialog
          open={isAddDialogOpen || isEditDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
              resetForm();
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {isEditDialogOpen ? "Edit User" : "Add New User"}
              </DialogTitle>
              <DialogDescription>
                {isEditDialogOpen
                  ? "Update the user information below."
                  : `Add a new ${
                      userType === "admin" ? "Admin" : "SE"
                    } user to the system.`}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {!isEditDialogOpen && (
                <div className="grid gap-2">
                  <Label htmlFor="userType">User Type</Label>
                  <Select
                    value={userType}
                    onValueChange={(value: "admin" | "se") =>
                      setUserType(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="se">SE (Sales Engineer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1 234 567 8900"
                />
              </div>
              {userType === "se" && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="costRate">Hourly Rate: Cost</Label>
                    <Input
                      id="costRate"
                      type="number"
                      value={formData.costRate}
                      onChange={(e) =>
                        setFormData({ ...formData, costRate: e.target.value })
                      }
                      placeholder="75"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="billRate">Hourly Rate: Billable</Label>
                    <Input
                      id="billRate"
                      type="number"
                      value={formData.billRate}
                      onChange={(e) =>
                        setFormData({ ...formData, billRate: e.target.value })
                      }
                      placeholder="150"
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setIsEditDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={isEditDialogOpen ? handleEditUser : handleAddUser}
                className="bg-[#141417] hover:bg-[#3b3b3b]"
              >
                {isEditDialogOpen ? "Save Changes" : "Add User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                user
                {selectedUser && ` "${selectedUser.full_name}"`} from the
                system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUser}
                className="bg-[#ce4343] hover:bg-[#ce4343]/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
