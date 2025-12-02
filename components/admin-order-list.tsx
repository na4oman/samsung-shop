"use client"

import { useState, useEffect } from "react"
import type { Order, OrderStatus } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Eye, Search } from "lucide-react"
import { getOrders, updateOrder } from "@/lib/order-service"

export default function AdminOrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch all orders (no user filter for admin)
        const allOrders = await getOrders()
        setOrders(allOrders)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // Update the order status
      await updateOrder(orderId, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        ...(newStatus === "shipped" ? { shippedAt: new Date().toISOString() } : {}),
        ...(newStatus === "delivered" ? { deliveredAt: new Date().toISOString() } : {}),
      })

      // Update the local state
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                updatedAt: new Date().toISOString(),
                ...(newStatus === "shipped" && !order.shippedAt ? { shippedAt: new Date().toISOString() } : {}),
                ...(newStatus === "delivered" && !order.deliveredAt ? { deliveredAt: new Date().toISOString() } : {}),
              }
            : order,
        ),
      )

      toast({
        title: "Order updated",
        description: `Order #${orderId} status changed to ${newStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating the order status.",
        variant: "destructive",
      })
    }
  }

  const handleAddTracking = async (orderId: string, trackingNumber: string) => {
    if (!trackingNumber.trim()) return

    try {
      // Update the order with tracking number
      await updateOrder(orderId, {
        trackingNumber,
        updatedAt: new Date().toISOString(),
      })

      // Update the local state
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                trackingNumber,
                updatedAt: new Date().toISOString(),
              }
            : order,
        ),
      )

      toast({
        title: "Tracking added",
        description: `Tracking number added to order #${orderId}.`,
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error adding the tracking number.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "processing":
        return "bg-blue-500"
      case "shipped":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false
    }

    // Search filter (order ID, customer name, or tracking number)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        order.id.toLowerCase().includes(query) ||
        order.shippingAddress.fullName.toLowerCase().includes(query) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(query))
      )
    }

    return true
  })

  if (isLoading) {
    return <div className="text-center py-8">Loading orders...</div>
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{order.shippingAddress.fullName}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={order.status}
                      onValueChange={(value) => handleUpdateStatus(order.id, value as OrderStatus)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue>
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {order.status === "shipped" || order.status === "delivered" ? (
                      order.trackingNumber ? (
                        <span>{order.trackingNumber}</span>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add tracking #"
                            className="w-32 h-8 text-xs"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleAddTracking(order.id, e.currentTarget.value)
                                e.currentTarget.value = ""
                              }
                            }}
                          />
                        </div>
                      )
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Order</span>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

