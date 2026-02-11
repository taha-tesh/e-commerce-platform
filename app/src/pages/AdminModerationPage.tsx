import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, Users, Store, Star, CheckCircle, XCircle,
  Search, MoreHorizontal, Eye 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { vendors, users, reviews } from '@/data/mockData';

export function AdminModerationPage() {
  const [activeTab, setActiveTab] = useState('vendors');
  const [searchQuery, setSearchQuery] = useState('');

  const handleApproveVendor = (_vendorId: string) => {
    toast.success('Vendor approved');
  };

  const handleRejectVendor = (_vendorId: string) => {
    toast.success('Vendor rejected');
  };

  const handleApproveReview = (_reviewId: string) => {
    toast.success('Review approved');
  };

  const handleRejectReview = (_reviewId: string) => {
    toast.success('Review rejected');
  };

  const filteredVendors = vendors.filter(v => 
    v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-6">
          <Link to="/" className="hover:text-[#FF6B35]">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/admin/dashboard" className="hover:text-[#FF6B35]">Admin</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1A1D21]">Moderation</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1D21]">
              Content Moderation
            </h1>
            <p className="text-[#6B7280]">
              Review and moderate platform content
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="vendors" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              Vendors
              <Badge variant="secondary" className="ml-1">
                {vendors.filter(v => v.status === 'pending').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vendors">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">Business</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">Products</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">Joined</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[#6B7280]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            {vendor.logo ? (
                              <img src={vendor.logo} alt="" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <Store className="w-5 h-5 text-[#6B7280]" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{vendor.businessName}</div>
                            <div className="text-sm text-[#6B7280]">{vendor.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">{vendor.email}</div>
                        <div className="text-sm text-[#6B7280]">{vendor.phone}</div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={
                          vendor.status === 'approved' ? 'bg-green-100 text-green-800' :
                          vendor.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {vendor.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">{vendor.productCount}</td>
                      <td className="px-4 py-4 text-sm">
                        {new Date(vendor.joinedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {vendor.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveVendor(vendor.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleRejectVendor(vendor.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="w-4 h-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">Joined</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[#6B7280]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-full flex items-center justify-center">
                            <span className="font-medium text-[#FF6B35]">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-[#6B7280]">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="secondary" className="capitalize">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={user.isVerified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                          {user.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="w-4 h-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">Reviewer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">Rating</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">Content</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[#6B7280]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="font-medium text-sm">
                          Product #{review.productId.slice(-4)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">{review.user.firstName} {review.user.lastName}</div>
                        {review.isVerifiedPurchase && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Verified Purchase
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-[#FF6B35] text-[#FF6B35]'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium">{review.title}</div>
                        <div className="text-sm text-[#6B7280] line-clamp-2">{review.content}</div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={
                          review.status === 'approved' ? 'bg-green-100 text-green-800' :
                          review.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {review.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {review.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveReview(review.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleRejectReview(review.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="w-4 h-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
