"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Department {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  exceptions: {
    email: boolean;
    sms: boolean;
  };
  access: {
    billing: boolean;
    admin: boolean;
  };
}

interface SolutionEngineer {
  id: string;
  name: string;
  email: string;
}

export function ClientForm() {
  const [companyName, setCompanyName] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [users, setUsers] = useState<User[]>([
    {
      id: "default-user",
      name: "",
      email: "",
      phone: "",
      department: "",
      exceptions: {
        email: false,
        sms: false,
      },
      access: {
        billing: false,
        admin: false,
      },
    },
  ]);
  const [engineers, setEngineers] = useState<SolutionEngineer[]>([
    {
      id: "default-engineer",
      name: "",
      email: "email@example.com",
    },
  ]);

  const addDepartment = () => {
    if (newDepartment.trim()) {
      setDepartments([
        ...departments,
        { id: crypto.randomUUID(), name: newDepartment },
      ]);
      setNewDepartment("");
    }
  };

  const removeDepartment = (id: string) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
  };

  const addUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      name: "",
      email: "",
      phone: "",
      department: "",
      exceptions: {
        email: false,
        sms: false,
      },
      access: {
        billing: false,
        admin: false,
      },
    };
    setUsers([...users, newUser]);
  };

  const removeUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const updateUser = (id: string, field: string, value: any) => {
    setUsers(
      users.map((user) => {
        if (user.id === id) {
          if (field.includes(".")) {
            const [parent, child] = field.split(".");
            return {
              ...user,
              [parent]: {
                ...(user[parent as keyof User] as Record<string, unknown>),
                [child]: value,
              },
            };
          }
          return { ...user, [field]: value };
        }
        return user;
      })
    );
  };

  const addEngineer = () => {
    const newEngineer: SolutionEngineer = {
      id: Date.now().toString(),
      name: "",
      email: "email@example.com",
    };
    setEngineers([...engineers, newEngineer]);
  };

  const removeEngineer = (id: string) => {
    setEngineers(engineers.filter((eng) => eng.id !== id));
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim()) {
      alert("Workflow name is required");
      return;
    }

    if (departments.length === 0) {
      alert("Create at least one department first.");
      return;
    }

    const nodes = [
      { name: "Read Email", type: "EMAIL_MONITOR", position: 1 },
      { name: "Create Lead", type: "CRM_POST", position: 2 },
    ];

    const payload = {
      name: companyName.trim(),
      departmentId: departments[0].id,
      nodes,
      description: companyUrl || null,
      timeSaved: 0.5,
      moneySaved: 1,
    };

    const res = await fetch("/api/client/workflows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const { error } = await res.json();
      alert("Failed: " + (error?.message ?? res.statusText));
      return;
    }

    router.push("/admin/clients");
  };

  return (
    <Card className="bg-white">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="company-name"
                  className="block text-sm font-medium mb-1"
                >
                  Company Name<span className="text-red-500">*</span>
                </label>
                <Input
                  id="company-name"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
              <div>
                <label
                  htmlFor="company-url"
                  className="block text-sm font-medium mb-1"
                >
                  Company URL<span className="text-red-500">*</span>
                </label>
                <Input
                  id="company-url"
                  placeholder="https://"
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
            </div>

            <div className="bg-[#f8f8f8] p-6 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Manage Departments</h3>
              <div className="space-y-2">
                {departments.map((dept) => (
                  <div key={dept.id} className="flex items-center gap-2">
                    <Input
                      value={dept.name}
                      onChange={(e) => {
                        setDepartments(
                          departments.map((d) =>
                            d.id === dept.id
                              ? { ...d, name: e.target.value }
                              : d
                          )
                        );
                      }}
                      className="bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeDepartment(dept.id)}
                      className="text-[#ce4343]"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Department name"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addDepartment}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" /> Add Department
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">Users</h3>

            {users.length > 0 && (
              <div className="mb-4 border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#f8f8f8] border-b">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">
                        Name
                      </th>
                      <th className="text-left p-3 text-sm font-medium">
                        Email
                      </th>
                      <th className="text-left p-3 text-sm font-medium">
                        Phone
                      </th>
                      <th className="text-left p-3 text-sm font-medium">
                        Department
                      </th>
                      <th className="text-left p-3 text-sm font-medium">
                        Exceptions
                      </th>
                      <th className="text-left p-3 text-sm font-medium">
                        Access
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b last:border-b-0">
                        <td className="p-3">
                          <Input
                            placeholder="Full name"
                            value={user.name}
                            onChange={(e) =>
                              updateUser(user.id, "name", e.target.value)
                            }
                            className="bg-white"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            placeholder="Email"
                            type="email"
                            value={user.email}
                            onChange={(e) =>
                              updateUser(user.id, "email", e.target.value)
                            }
                            className="bg-white"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            placeholder="Phone"
                            type="tel"
                            value={user.phone}
                            onChange={(e) =>
                              updateUser(user.id, "phone", e.target.value)
                            }
                            className="bg-white"
                          />
                        </td>
                        <td className="p-3">
                          <select
                            value={user.department}
                            onChange={(e) =>
                              updateUser(user.id, "department", e.target.value)
                            }
                            className="w-full p-2 border rounded-md bg-white"
                          >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                              <option key={dept.id} value={dept.id}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Checkbox
                                id={`email-${user.id}`}
                                checked={user.exceptions.email}
                                onCheckedChange={(checked) =>
                                  updateUser(
                                    user.id,
                                    "exceptions.email",
                                    checked === true
                                  )
                                }
                              />
                              <label
                                htmlFor={`email-${user.id}`}
                                className="text-sm"
                              >
                                Email
                              </label>
                            </div>
                            <div className="flex items-center gap-1">
                              <Checkbox
                                id={`sms-${user.id}`}
                                checked={user.exceptions.sms}
                                onCheckedChange={(checked) =>
                                  updateUser(
                                    user.id,
                                    "exceptions.sms",
                                    checked === true
                                  )
                                }
                              />
                              <label
                                htmlFor={`sms-${user.id}`}
                                className="text-sm"
                              >
                                SMS
                              </label>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Checkbox
                                id={`billing-${user.id}`}
                                checked={user.access.billing}
                                onCheckedChange={(checked) =>
                                  updateUser(
                                    user.id,
                                    "access.billing",
                                    checked === true
                                  )
                                }
                              />
                              <label
                                htmlFor={`billing-${user.id}`}
                                className="text-sm"
                              >
                                Billing Access
                              </label>
                            </div>
                            <div className="flex items-center gap-1">
                              <Checkbox
                                id={`admin-${user.id}`}
                                checked={user.access.admin}
                                onCheckedChange={(checked) =>
                                  updateUser(
                                    user.id,
                                    "access.admin",
                                    checked === true
                                  )
                                }
                              />
                              <label
                                htmlFor={`admin-${user.id}`}
                                className="text-sm"
                              >
                                Admin Access
                              </label>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => removeUser(user.id)}
                            className="text-[#ce4343]"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={addUser}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" /> Add User
            </Button>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">
              Assign Solutions Engineers
            </h3>

            {engineers.length > 0 && (
              <div className="mb-4 border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#f8f8f8] border-b">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">
                        Name
                      </th>
                      <th className="text-left p-3 text-sm font-medium">
                        Email
                      </th>
                      <th className="text-left p-3 text-sm font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {engineers.map((engineer) => (
                      <tr
                        key={engineer.id}
                        className="border-b last:border-b-0"
                      >
                        <td className="p-3">
                          <select
                            value={engineer.name}
                            onChange={(e) => {
                              setEngineers(
                                engineers.map((eng) =>
                                  eng.id === engineer.id
                                    ? { ...eng, name: e.target.value }
                                    : eng
                                )
                              );
                            }}
                            className="w-full p-2 border rounded-md bg-white"
                          >
                            <option value="">Select SE</option>
                            <option value="John Doe">John Doe</option>
                            <option value="Jane Smith">Jane Smith</option>
                            <option value="Alex Johnson">Alex Johnson</option>
                          </select>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {engineer.email}
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => removeEngineer(engineer.id)}
                            className="text-[#ce4343]"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={addEngineer}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" /> Add Solutions Engineer
            </Button>
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/admin/clients">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-[#141417] hover:bg-[#141417]/90"
            >
              Create Client
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
