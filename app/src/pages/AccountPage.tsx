import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Package, Heart, MapPin, CreditCard, 
  ChevronRight, Edit2, Camera, Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

export function AccountPage() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSave = () => {
    updateUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
    });
    setIsEditing(false);
    toast.success(t('account.profileUpdated') || 'Profile updated successfully');
  };

  const menuItems = [
    { icon: Package, label: t('account.myOrders'), href: '/orders', description: t('account.ordersDesc') },
    { icon: Heart, label: t('account.wishlist'), href: '/wishlist', description: t('account.wishlistDesc') },
    { icon: MapPin, label: t('account.addresses'), href: '/account/addresses', description: t('account.addressesDesc') },
    { icon: CreditCard, label: t('account.paymentMethods'), href: '/account/payment', description: t('account.paymentDesc') },
    { icon: Bell, label: t('account.notifications'), href: '/account/notifications', description: t('account.notificationsDesc') },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-6">
          <Link to="/" className="hover:text-[#FF6B35]">{t('nav.home')}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1A1D21]">{t('account.title')}</span>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-[#FF6B35]" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-6 h-6 bg-[#FF6B35] rounded-full flex items-center justify-center">
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                </div>
                <div>
                  <div className="font-semibold text-[#1A1D21]">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-sm text-[#6B7280]">{user?.email}</div>
                  <div className="text-xs text-[#FF6B35] capitalize mt-1">
                    {user?.role} {t('account.account')}
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#6B7280] hover:bg-gray-50 hover:text-[#1A1D21] transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-[#1A1D21]">{t('account.profileInfo')}</h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  {isEditing ? t('account.cancel') : t('account.edit')}
                </Button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{t('account.firstName')}</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t('account.lastName')}</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">{t('account.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-[#6B7280] mt-1">
                      {t('account.emailCannotChange') || 'Email cannot be changed. Contact support for assistance.'}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone">{t('account.phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleSave} className="bg-[#FF6B35] hover:bg-[#e55a2b]">
                      {t('account.saveChanges')}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      {t('common.cancel')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-[#6B7280] mb-1">{t('account.firstName')}</div>
                      <div className="font-medium">{user?.firstName}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-[#6B7280] mb-1">{t('account.lastName')}</div>
                      <div className="font-medium">{user?.lastName}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-[#6B7280] mb-1">{t('account.email')}</div>
                    <div className="font-medium">{user?.email}</div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-[#6B7280] mb-1">{t('account.phone')}</div>
                    <div className="font-medium">{user?.phone || t('account.notProvided') || 'Not provided'}</div>
                  </div>

                  {user?.companyName && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-[#6B7280] mb-1">{t('account.company') || 'Company'}</div>
                      <div className="font-medium">{user.companyName}</div>
                    </div>
                  )}

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-[#6B7280] mb-1">{t('account.memberSince')}</div>
                    <div className="font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {menuItems.slice(0, 4).map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center group-hover:bg-[#FF6B35] transition-colors">
                        <item.icon className="w-5 h-5 text-[#FF6B35] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#1A1D21]">{item.label}</div>
                        <div className="text-sm text-[#6B7280]">{item.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#FF6B35] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
