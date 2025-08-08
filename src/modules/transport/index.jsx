import React, { useState, useEffect } from 'react';
import {
  Clock,
  Truck,
  Package,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Bell,
  MapPin,
  Calendar,
  Timer,
  AlertCircle,
} from 'lucide-react';

const ShippingSLAComparison = () => {
  const [activeTab, setActiveTab] = useState('sla');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alerts, setAlerts] = useState([]);
  const [customCutoffs, setCustomCutoffs] = useState({});

  // Dữ liệu nhà vận chuyển
  const carriers = [
    {
      name: 'GHN',
      marketShare: '7.91%',
      cutoffTime: '14:00',
      pickupTime: '2-4h',
      sameDayDelivery: 'Có',
      hcmcDelivery: '24h',
      provincesDelivery: '1-2 ngày',
      weightLimit: '30kg',
      sizeLimit: '150cm',
      specialService: 'Express 4h',
      cost: 'Trung bình',
      reliability: 85,
      shopeeRating: 4.2,
      tiktokRating: 4.1,
      color: 'bg-orange-500',
    },
    {
      name: 'GHTK',
      marketShare: '14.5%',
      cutoffTime: '14:00',
      pickupTime: '2-6h',
      sameDayDelivery: 'Không',
      hcmcDelivery: '1-2 ngày',
      provincesDelivery: '2-3 ngày',
      weightLimit: '50kg',
      sizeLimit: '200cm',
      specialService: 'Hàng cồng kềnh',
      cost: 'Rẻ nhất',
      reliability: 78,
      shopeeRating: 3.9,
      tiktokRating: 3.8,
      color: 'bg-green-500',
    },
    {
      name: 'Viettel Post',
      marketShare: '17.2%',
      cutoffTime: '16:00',
      pickupTime: '1-3h',
      sameDayDelivery: 'Có',
      hcmcDelivery: '12-24h',
      provincesDelivery: '1-2 ngày',
      weightLimit: '50kg',
      sizeLimit: '180cm',
      specialService: '24/7 pickup',
      cost: 'Kinh tế nhất',
      reliability: 92,
      shopeeRating: 4.5,
      tiktokRating: 4.4,
      color: 'bg-red-500',
    },
    {
      name: 'J&T Express',
      marketShare: '10.6%',
      cutoffTime: '21:00',
      pickupTime: '1-2h',
      sameDayDelivery: 'Có',
      hcmcDelivery: '12-24h',
      provincesDelivery: '1-3 ngày',
      weightLimit: '60kg',
      sizeLimit: '200cm',
      specialService: '100% on-time',
      cost: 'Cạnh tranh',
      reliability: 95,
      shopeeRating: 4.6,
      tiktokRating: 4.5,
      color: 'bg-purple-500',
    },
    {
      name: 'Ninja Van',
      marketShare: '2.8%',
      cutoffTime: '11:45',
      pickupTime: '2-4h',
      sameDayDelivery: 'Có',
      hcmcDelivery: '1-2 ngày',
      provincesDelivery: '2-3 ngày',
      weightLimit: '30kg',
      sizeLimit: '300cm',
      specialService: 'Tracking 24/7',
      cost: 'Cao',
      reliability: 82,
      shopeeRating: 4.0,
      tiktokRating: 3.9,
      color: 'bg-indigo-500',
    },
  ];

  // Móc thời gian chi tiết theo quy định sàn và NVC
  const detailedTimeAnchors = {
    tiktok: {
      name: 'TikTok Shop',
      platformRules: {
        orderConfirmDeadline: '24h từ lúc đặt hàng',
        handoverDeadline: '1 ngày làm việc (Ship by Seller)',
        lateDispatchPenalty: 'LDR ≤ 4%',
        criticalSLA: 'Same Day Delivery ưu tiên',
      },
      carrierAnchors: {
        'J&T Express': {
          confirmationRules: [
            {
              orderTime: '00:00-08:00',
              mustConfirmBy: '10:00 cùng ngày',
              reason: 'Đảm bảo bàn giao trong ngày',
              example: 'Đặt 07:30 → Xác nhận trước 10:00',
            },
            {
              orderTime: '08:01-16:00',
              mustConfirmBy: '18:00 cùng ngày',
              reason: 'Tận dụng cut-off 21:00',
              example: 'Đặt 14:00 → Xác nhận trước 18:00',
            },
            {
              orderTime: '16:01-23:59',
              mustConfirmBy: '08:00 hôm sau',
              reason: 'Chuẩn bị cho pickup sáng',
              example: 'Đặt 20:00 → Xác nhận trước 8:00 hôm sau',
            },
          ],
          handoverRules: [
            {
              confirmTime: '08:00-12:00',
              mustHandoverBy: '15:00 cùng ngày',
              processingTime: '3-7h',
              example: 'Xác nhận 10:00 → Bàn giao 13:00-15:00',
            },
            {
              confirmTime: '12:01-18:00',
              mustHandoverBy: '21:00 cùng ngày',
              processingTime: '3-5h',
              example: 'Xác nhận 16:00 → Bàn giao 19:00-21:00',
            },
            {
              confirmTime: '18:01-23:59',
              mustHandoverBy: '12:00 hôm sau',
              processingTime: '12-16h',
              example: 'Xác nhận 20:00 → Bàn giao 8:00-12:00 hôm sau',
            },
          ],
        },
        'Viettel Post': {
          confirmationRules: [
            {
              orderTime: '00:00-10:00',
              mustConfirmBy: '12:00 cùng ngày',
              reason: 'Tận dụng cut-off 16:00',
              example: 'Đặt 08:00 → Xác nhận trước 12:00',
            },
            {
              orderTime: '10:01-18:00',
              mustConfirmBy: '20:00 cùng ngày',
              reason: 'Chuẩn bị cho pickup sáng sau',
              example: 'Đặt 15:00 → Xác nhận trước 20:00',
            },
            {
              orderTime: '18:01-23:59',
              mustConfirmBy: '10:00 hôm sau',
              reason: '24/7 service flexibility',
              example: 'Đặt 22:00 → Xác nhận trước 10:00 hôm sau',
            },
          ],
          handoverRules: [
            {
              confirmTime: '08:00-14:00',
              mustHandoverBy: '16:00 cùng ngày',
              processingTime: '2-6h',
              example: 'Xác nhận 12:00 → Bàn giao 14:00-16:00',
            },
            {
              confirmTime: '14:01-20:00',
              mustHandoverBy: '10:00 hôm sau',
              processingTime: '14-20h',
              example: 'Xác nhận 18:00 → Bàn giao 8:00-10:00 hôm sau',
            },
          ],
        },
      },
    },
    shopee: {
      name: 'Shopee',
      platformRules: {
        orderConfirmDeadline: '48h từ lúc đặt hàng',
        handoverDeadline: '5 ngày làm việc sau xác nhận',
        lateDispatchPenalty: 'OTSR < 90% = hạn chế',
        criticalSLA: 'Preferred Seller status',
      },
      carrierAnchors: {
        GHN: {
          confirmationRules: [
            {
              orderTime: '00:00-12:00',
              mustConfirmBy: '18:00 cùng ngày',
              reason: 'Bàn giao ngày hôm sau',
              example: 'Đặt 10:00 → Xác nhận trước 18:00',
            },
            {
              orderTime: '12:01-20:00',
              mustConfirmBy: '12:00 hôm sau',
              reason: 'Chuẩn bị pickup chiều',
              example: 'Đặt 16:00 → Xác nhận trước 12:00 hôm sau',
            },
            {
              orderTime: '20:01-23:59',
              mustConfirmBy: '12:00 hôm sau',
              reason: 'Batch xử lý sáng',
              example: 'Đặt 22:00 → Xác nhận trước 12:00 hôm sau',
            },
          ],
          handoverRules: [
            {
              confirmTime: '08:00-12:00',
              mustHandoverBy: '14:00 cùng ngày',
              processingTime: '2-6h',
              example: 'Xác nhận 10:00 → Bàn giao 12:00-14:00',
              specialNote: 'Vali cồng kềnh: thêm 1-2h',
            },
            {
              confirmTime: '12:01-18:00',
              mustHandoverBy: '12:00 hôm sau',
              processingTime: '18-24h',
              example: 'Xác nhận 16:00 → Bàn giao 8:00-12:00 hôm sau',
            },
          ],
        },
        'J&T Express': {
          confirmationRules: [
            {
              orderTime: '00:00-15:00',
              mustConfirmBy: '18:00 cùng ngày',
              reason: 'Tận dụng cut-off 21:00',
              example: 'Đặt 12:00 → Xác nhận trước 18:00',
            },
            {
              orderTime: '15:01-23:59',
              mustConfirmBy: '12:00 hôm sau',
              reason: 'Chuẩn bị batch tiếp theo',
              example: 'Đặt 20:00 → Xác nhận trước 12:00 hôm sau',
            },
          ],
          handoverRules: [
            {
              confirmTime: '08:00-18:00',
              mustHandoverBy: '21:00 cùng ngày',
              processingTime: '3-8h',
              example: 'Xác nhận 14:00 → Bàn giao 17:00-21:00',
            },
            {
              confirmTime: '18:01-23:59',
              mustHandoverBy: '15:00 hôm sau',
              processingTime: '16-21h',
              example: 'Xác nhận 20:00 → Bàn giao 10:00-15:00 hôm sau',
            },
          ],
        },
      },
    },
  };

  // Kịch bản thực tế với ví dụ cụ thể
  const realWorldScenarios = [
    {
      title: '🌅 Kịch bản Sáng - Đơn hàng lúc 8:00',
      platforms: {
        tiktok: {
          timeline: [
            {
              time: '08:00',
              action: 'Khách đặt hàng vali 28 inch',
              status: 'order',
            },
            {
              time: '08:05',
              action: 'Hệ thống gửi thông báo',
              status: 'notification',
            },
            {
              time: '09:30',
              action: '✅ Xác nhận đơn hàng (deadline 10:00)',
              status: 'confirm',
            },
            { time: '10:00', action: 'Bắt đầu đóng gói', status: 'packing' },
            {
              time: '12:30',
              action: '✅ Bàn giao J&T (deadline 15:00)',
              status: 'handover',
            },
            {
              time: '14:00',
              action: 'J&T pickup thành công',
              status: 'pickup',
            },
            {
              time: '18:00',
              action: 'Giao hàng thành công',
              status: 'delivered',
            },
          ],
          result: '✅ Đạt SLA - Same day delivery',
        },
        shopee: {
          timeline: [
            {
              time: '08:00',
              action: 'Khách đặt hàng vali 28 inch',
              status: 'order',
            },
            {
              time: '08:30',
              action: 'Hệ thống gửi thông báo',
              status: 'notification',
            },
            {
              time: '16:00',
              action: '✅ Xác nhận đơn hàng (deadline 18:00)',
              status: 'confirm',
            },
            { time: '16:30', action: 'Bắt đầu đóng gói', status: 'packing' },
            {
              time: '09:00+1',
              action: '✅ Bàn giao GHN (deadline 12:00)',
              status: 'handover',
            },
            {
              time: '11:00+1',
              action: 'GHN pickup thành công',
              status: 'pickup',
            },
            {
              time: '16:00+1',
              action: 'Giao hàng thành công',
              status: 'delivered',
            },
          ],
          result: '✅ Đạt SLA - Giao trong 2 ngày',
        },
      },
    },
    {
      title: '🌆 Kịch bản Chiều - Đơn hàng lúc 16:00',
      platforms: {
        tiktok: {
          timeline: [
            {
              time: '16:00',
              action: 'Khách đặt hàng vali 24 inch',
              status: 'order',
            },
            {
              time: '16:05',
              action: 'Hệ thống gửi thông báo',
              status: 'notification',
            },
            {
              time: '17:30',
              action: '✅ Xác nhận đơn hàng (deadline 18:00)',
              status: 'confirm',
            },
            {
              time: '18:00',
              action: 'Bắt đầu đóng gói khẩn cấp',
              status: 'packing',
            },
            {
              time: '20:30',
              action: '✅ Bàn giao J&T (deadline 21:00)',
              status: 'handover',
            },
            {
              time: '21:30',
              action: 'J&T pickup thành công',
              status: 'pickup',
            },
            {
              time: '10:00+1',
              action: 'Giao hàng thành công',
              status: 'delivered',
            },
          ],
          result: '⚠️ Gần miss SLA - Cần optimize',
        },
        shopee: {
          timeline: [
            {
              time: '16:00',
              action: 'Khách đặt hàng vali 24 inch',
              status: 'order',
            },
            {
              time: '16:30',
              action: 'Hệ thống gửi thông báo',
              status: 'notification',
            },
            {
              time: '11:00+1',
              action: '✅ Xác nhận đơn hàng (deadline 12:00)',
              status: 'confirm',
            },
            { time: '11:30+1', action: 'Bắt đầu đóng gói', status: 'packing' },
            {
              time: '13:30+1',
              action: '✅ Bàn giao J&T (deadline 15:00)',
              status: 'handover',
            },
            {
              time: '15:00+1',
              action: 'J&T pickup thành công',
              status: 'pickup',
            },
            {
              time: '18:00+1',
              action: 'Giao hàng thành công',
              status: 'delivered',
            },
          ],
          result: '✅ Đạt SLA - Giao trong 2 ngày',
        },
      },
    },
    {
      title: '🌙 Kịch bản Tối - Đơn hàng lúc 22:00',
      platforms: {
        tiktok: {
          timeline: [
            {
              time: '22:00',
              action: 'Khách đặt hàng vali set 3 chiếc',
              status: 'order',
            },
            {
              time: '22:05',
              action: 'Hệ thống gửi thông báo',
              status: 'notification',
            },
            {
              time: '07:30+1',
              action: '✅ Xác nhận đơn hàng (deadline 08:00)',
              status: 'confirm',
            },
            { time: '08:00+1', action: 'Bắt đầu đóng gói', status: 'packing' },
            {
              time: '11:00+1',
              action: '✅ Bàn giao J&T (deadline 12:00)',
              status: 'handover',
            },
            {
              time: '13:00+1',
              action: 'J&T pickup thành công',
              status: 'pickup',
            },
            {
              time: '18:00+1',
              action: 'Giao hàng thành công',
              status: 'delivered',
            },
          ],
          result: '✅ Đạt SLA - Xử lý ngày hôm sau',
        },
        shopee: {
          timeline: [
            {
              time: '22:00',
              action: 'Khách đặt hàng vali set 3 chiếc',
              status: 'order',
            },
            {
              time: '22:30',
              action: 'Hệ thống gửi thông báo',
              status: 'notification',
            },
            {
              time: '11:00+1',
              action: '✅ Xác nhận đơn hàng (deadline 12:00)',
              status: 'confirm',
            },
            { time: '11:30+1', action: 'Bắt đầu đóng gói', status: 'packing' },
            {
              time: '08:00+2',
              action: '✅ Bàn giao GHN (deadline 12:00)',
              status: 'handover',
            },
            {
              time: '10:00+2',
              action: 'GHN pickup thành công',
              status: 'pickup',
            },
            {
              time: '16:00+2',
              action: 'Giao hàng thành công',
              status: 'delivered',
            },
          ],
          result: '✅ Đạt SLA - Giao trong 3 ngày',
        },
      },
    },
  ];

  // Auto update thời gian mỗi phút
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Kiểm tra cảnh báo cut-off time
  useEffect(() => {
    const checkAlerts = () => {
      const newAlerts = [];
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeMinutes = currentHour * 60 + currentMinute;

      carriers.forEach((carrier) => {
        const cutoffTime = customCutoffs[carrier.name] || carrier.cutoffTime;
        const [cutoffHour, cutoffMinute] = cutoffTime.split(':').map(Number);
        const cutoffTimeMinutes = cutoffHour * 60 + cutoffMinute;
        const minutesLeft = cutoffTimeMinutes - currentTimeMinutes;

        if (minutesLeft > 0 && minutesLeft <= 60) {
          newAlerts.push({
            type: 'warning',
            carrier: carrier.name,
            message: `Còn ${minutesLeft} phút đến cut-off ${carrier.name}`,
            minutesLeft,
          });
        } else if (minutesLeft <= 0 && minutesLeft > -60) {
          newAlerts.push({
            type: 'danger',
            carrier: carrier.name,
            message: `${carrier.name} đã quá cut-off ${Math.abs(
              minutesLeft
            )} phút`,
            minutesLeft: 0,
          });
        }
      });

      setAlerts(newAlerts);
    };

    checkAlerts();
  }, [currentTime, customCutoffs, carriers]);

  // Thông tin cập nhật platform mới nhất
  const platformUpdates = {
    shopee: {
      lastUpdate: '10/06/2025',
      changes: 'Tăng yêu cầu OTSR lên 92%',
      newFeatures: 'Shopee Express mới',
      status: 'active',
    },
    tiktok: {
      lastUpdate: '08/06/2025',
      changes: 'Bổ sung Same Day Delivery',
      newFeatures: 'TikTok Fulfillment by Seller+',
      status: 'updated',
    },
    website: {
      lastUpdate: '12/06/2025',
      changes: 'Tích hợp API tracking mới',
      newFeatures: 'Real-time notification',
      status: 'latest',
    },
  };

  // Deadline giả định cho từng sàn
  const platformRequirements = {
    shopee: {
      orderConfirm: '24-48h',
      handoverTime: '3-5 ngày',
      totalTime: '5-11 ngày',
      penalty: 'Hạn chế tài khoản',
      criticalSLA: 'OTSR > 90%',
    },
    tiktok: {
      orderConfirm: '24h',
      handoverTime: '1-4 ngày',
      totalTime: '3-8 ngày',
      penalty: 'Điểm vi phạm',
      criticalSLA: 'LDR ≤ 4%',
    },
    website: {
      orderConfirm: '5 phút',
      handoverTime: '24-48h',
      totalTime: '4-8 ngày',
      penalty: 'Mất khách hàng',
      criticalSLA: 'Response < 1h',
    },
  };

  // Báo cáo đơn hàng trễ
  const lateOrdersReport = {
    today: {
      total: 47,
      byCarrier: {
        GHN: 12,
        GHTK: 18,
        'Viettel Post': 5,
        'J&T Express': 3,
        'Ninja Van': 9,
      },
      byPlatform: {
        Shopee: 23,
        'TikTok Shop': 15,
        Website: 9,
      },
    },
    thisWeek: {
      total: 284,
      trend: '+12%',
    },
  };

  // Thông tin bưu cục gần nhất
  const nearestDepots = [
    {
      carrier: 'GHN',
      name: 'Hub Quận 1',
      address: '123 Nguyễn Huệ, Q.1, TP.HCM',
      distance: '2.3km',
      phone: '1900 1900',
      workingHours: '8:00-22:00',
      lastPickup: '20:30',
    },
    {
      carrier: 'GHTK',
      name: 'Kho Tân Bình',
      address: '456 Hoàng Văn Thụ, Tân Bình, TP.HCM',
      distance: '3.1km',
      phone: '1900 1902',
      workingHours: '7:30-21:30',
      lastPickup: '20:00',
    },
    {
      carrier: 'Viettel Post',
      name: 'Bưu cục 700000',
      address: '789 Lê Lợi, Q.1, TP.HCM',
      distance: '1.8km',
      phone: '1900 1886',
      workingHours: '24/7',
      lastPickup: '23:00',
    },
    {
      carrier: 'J&T Express',
      name: 'Sorting Center HCM',
      address: '321 Điện Biên Phủ, Q.3, TP.HCM',
      distance: '4.2km',
      phone: '1900 1886',
      workingHours: '6:00-23:00',
      lastPickup: '22:30',
    },
    {
      carrier: 'Ninja Van',
      name: 'Hub TP.HCM',
      address: '654 Võ Văn Tần, Q.3, TP.HCM',
      distance: '3.7km',
      phone: '1900 1886',
      workingHours: '8:00-20:00',
      lastPickup: '19:30',
    },
  ];

  // Đề xuất tối ưu
  const optimizations = [
    {
      time: '07:00-09:00',
      action: 'Xử lý đơn hàng đêm trước',
      carriers: ['J&T', 'Viettel Post'],
      priority: 'Cao',
      reason: 'Pickup sớm, giao cùng ngày',
    },
    {
      time: '09:00-14:00',
      action: 'Đóng gói và chuẩn bị hàng',
      carriers: ['Tất cả'],
      priority: 'Quan trọng',
      reason: 'Cut-off time chung',
    },
    {
      time: '14:00-16:00',
      action: 'Bàn giao hàng cồng kềnh',
      carriers: ['GHTK', 'Viettel Post'],
      priority: 'Trung bình',
      reason: 'Xử lý vali nặng',
    },
    {
      time: '16:00-21:00',
      action: 'Đơn hàng khẩn cấp',
      carriers: ['J&T', 'GHN'],
      priority: 'Cao',
      reason: 'Cut-off muộn nhất',
    },
  ];

  // Function tính thời gian còn lại đến cut-off
  const getTimeUntilCutoff = (cutoffTime) => {
    const now = new Date();
    const [cutoffHour, cutoffMinute] = cutoffTime.split(':').map(Number);
    const cutoff = new Date();
    cutoff.setHours(cutoffHour, cutoffMinute, 0, 0);

    if (cutoff < now) {
      cutoff.setDate(cutoff.getDate() + 1);
    }

    const diffMs = cutoff - now;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} phút`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}p`;
    }
  };

  // Function cập nhật custom cutoff time
  const updateCutoffTime = (carrier, newTime) => {
    setCustomCutoffs((prev) => ({
      ...prev,
      [carrier]: newTime,
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Cao':
        return 'bg-red-100 text-red-800';
      case 'Quan trọng':
        return 'bg-yellow-100 text-yellow-800';
      case 'Trung bình':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReliabilityColor = (reliability) => {
    if (reliability >= 90) return 'text-green-600';
    if (reliability >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'order':
        return 'bg-blue-100 text-blue-800';
      case 'notification':
        return 'bg-gray-100 text-gray-800';
      case 'confirm':
        return 'bg-green-100 text-green-800';
      case 'packing':
        return 'bg-yellow-100 text-yellow-800';
      case 'handover':
        return 'bg-purple-100 text-purple-800';
      case 'pickup':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Truck className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              So Sánh SLA Nhà Vận Chuyển - Mia.vn
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span>Miền Nam | Volume: 600-700 đơn/ngày | Sản phẩm: Vali</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                Cập nhật: {currentTime.toLocaleTimeString('vi-VN')}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'sla', label: 'SLA Nhà Vận Chuyển', icon: Clock },
            { id: 'platforms', label: 'Yêu Cầu Sàn', icon: Package },
            { id: 'timeline', label: 'Móc Thời Gian', icon: Timer },
            { id: 'scenarios', label: 'Kịch Bản Thực Tế', icon: CheckCircle },
            { id: 'optimization', label: 'Tối Ưu Vận Hành', icon: TrendingUp },
            {
              id: 'alerts',
              label: 'Cảnh Báo & Tracking',
              icon: Bell,
              badge: alerts.length,
            },
            { id: 'depots', label: 'Bưu Cục Gần Nhất', icon: MapPin },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all relative text-sm md:text-base ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                {tab.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* SLA Comparison Table */}
        {activeTab === 'sla' && (
          <div className="space-y-4">
            {/* Real-time Status Bar */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Timer className="w-6 h-6" />
                  <div>
                    <h3 className="font-bold">Thời Gian Hiện Tại</h3>
                    <p className="text-blue-100">
                      {currentTime.toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-sm text-blue-100">Đơn hôm nay</div>
                    <div className="text-xl font-bold">673</div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-100">Đã xử lý</div>
                    <div className="text-xl font-bold text-green-300">625</div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-100">Chờ pickup</div>
                    <div className="text-xl font-bold text-yellow-300">35</div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-100">Trễ hạn</div>
                    <div className="text-xl font-bold text-red-300">13</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[1000px]">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4 text-left font-semibold text-gray-900 border-b">
                        Nhà Vận Chuyển
                      </th>
                      <th className="p-4 text-center font-semibold text-gray-900 border-b">
                        Thị Phần
                      </th>
                      <th className="p-4 text-center font-semibold text-gray-900 border-b">
                        Cut-off Time
                      </th>
                      <th className="p-4 text-center font-semibold text-gray-900 border-b">
                        Thời Gian Còn Lại
                      </th>
                      <th className="p-4 text-center font-semibold text-gray-900 border-b">
                        Pickup Time
                      </th>
                      <th className="p-4 text-center font-semibold text-gray-900 border-b">
                        TPHCM
                      </th>
                      <th className="p-4 text-center font-semibold text-gray-900 border-b">
                        Các Tỉnh
                      </th>
                      <th className="p-4 text-center font-semibold text-gray-900 border-b">
                        Trọng Lượng
                      </th>
                      <th className="p-4 text-center font-semibold text-gray-900 border-b">
                        Độ Tin Cậy
                      </th>
                      <th className="p-4 text-center font-semibold text-gray-900 border-b">
                        Chi Phí
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {carriers.map((carrier, index) => {
                      const cutoffTime =
                        customCutoffs[carrier.name] || carrier.cutoffTime;
                      const timeLeft = getTimeUntilCutoff(cutoffTime);
                      const isNearCutoff =
                        timeLeft.includes('phút') && parseInt(timeLeft) <= 60;

                      return (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4 border-b">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 rounded-full ${carrier.color}`}
                              ></div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {carrier.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {carrier.specialService}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center border-b">
                            <span className="font-medium text-blue-600">
                              {carrier.marketShare}
                            </span>
                          </td>
                          <td className="p-4 text-center border-b">
                            <div className="space-y-1">
                              <input
                                type="time"
                                value={cutoffTime}
                                onChange={(e) =>
                                  updateCutoffTime(carrier.name, e.target.value)
                                }
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium border-0 text-center w-20"
                              />
                            </div>
                          </td>
                          <td className="p-4 text-center border-b">
                            <span
                              className={`px-2 py-1 rounded text-sm font-bold ${
                                isNearCutoff
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {timeLeft}
                            </span>
                          </td>
                          <td className="p-4 text-center border-b text-gray-700">
                            {carrier.pickupTime}
                          </td>
                          <td className="p-4 text-center border-b">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                              {carrier.hcmcDelivery}
                            </span>
                          </td>
                          <td className="p-4 text-center border-b">
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                              {carrier.provincesDelivery}
                            </span>
                          </td>
                          <td className="p-4 text-center border-b text-gray-700">
                            {carrier.weightLimit}
                          </td>
                          <td className="p-4 text-center border-b">
                            <span
                              className={`font-bold ${getReliabilityColor(
                                carrier.reliability
                              )}`}
                            >
                              {carrier.reliability}%
                            </span>
                          </td>
                          <td className="p-4 text-center border-b">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                carrier.cost === 'Kinh tế nhất'
                                  ? 'bg-green-100 text-green-800'
                                  : carrier.cost === 'Rẻ nhất'
                                  ? 'bg-green-100 text-green-800'
                                  : carrier.cost === 'Cao'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {carrier.cost}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Platform Requirements */}
        {activeTab === 'platforms' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6" />
                <h3 className="text-2xl font-bold">Cập Nhật Chính Sách Sàn</h3>
              </div>
              <p className="text-green-100">
                Thông tin mới nhất từ các sàn thương mại điện tử
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(platformRequirements).map(([platform, req]) => {
                const updates = platformUpdates[platform];
                return (
                  <div
                    key={platform}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Package className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900 capitalize">
                          {platform === 'tiktok'
                            ? 'TikTok Shop'
                            : platform === 'website'
                            ? 'Website Riêng'
                            : 'Shopee'}
                        </h3>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          updates.status === 'latest'
                            ? 'bg-green-100 text-green-800'
                            : updates.status === 'updated'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {updates.lastUpdate}
                      </span>
                    </div>

                    <div className="bg-white rounded-lg p-3 mb-4 border border-blue-200">
                      <div className="text-xs font-medium text-blue-800 mb-1">
                        Cập nhật mới nhất:
                      </div>
                      <div className="text-sm text-blue-600 mb-2">
                        {updates.changes}
                      </div>
                      <div className="text-xs text-gray-600">
                        <strong>Tính năng mới:</strong> {updates.newFeatures}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Xác nhận đơn:</span>
                        <span className="font-semibold text-blue-600">
                          {req.orderConfirm}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          Bàn giao vận chuyển:
                        </span>
                        <span className="font-semibold text-green-600">
                          {req.handoverTime}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tổng thời gian:</span>
                        <span className="font-semibold text-purple-600">
                          {req.totalTime}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-blue-200">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-red-600">
                              Hình phạt:
                            </div>
                            <div className="text-sm text-gray-600">
                              {req.penalty}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-blue-200">
                        <div className="text-sm font-medium text-blue-800">
                          SLA Quan trọng:
                        </div>
                        <div className="text-sm text-blue-600">
                          {req.criticalSLA}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Timeline Móc Thời Gian Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Timer className="w-6 h-6" />
                <h3 className="text-2xl font-bold">
                  Móc Thời Gian Quy Định Chi Tiết
                </h3>
              </div>
              <p className="text-purple-100">
                Deadline xác nhận và bàn giao theo từng khung giờ đặt hàng
              </p>
            </div>

            {Object.entries(detailedTimeAnchors).map(
              ([platformKey, platform]) => (
                <div
                  key={platformKey}
                  className="bg-white rounded-xl p-6 border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Package
                      className={`w-8 h-8 ${
                        platformKey === 'tiktok'
                          ? 'text-pink-600'
                          : 'text-orange-600'
                      }`}
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {platform.name}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 mt-2 text-sm">
                        <div className="bg-gray-50 rounded p-2">
                          <strong>Xác nhận:</strong>{' '}
                          {platform.platformRules.orderConfirmDeadline}
                        </div>
                        <div className="bg-gray-50 rounded p-2">
                          <strong>Bàn giao:</strong>{' '}
                          {platform.platformRules.handoverDeadline}
                        </div>
                      </div>
                    </div>
                  </div>

                  {Object.entries(platform.carrierAnchors).map(
                    ([carrierName, carrierData]) => (
                      <div
                        key={carrierName}
                        className="mb-8 border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div
                            className={`w-6 h-6 rounded-full ${
                              carriers.find((c) => c.name === carrierName)
                                ?.color || 'bg-gray-400'
                            }`}
                          ></div>
                          <h4 className="text-xl font-bold text-gray-900">
                            {carrierName}
                          </h4>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            Cut-off:{' '}
                            {
                              carriers.find((c) => c.name === carrierName)
                                ?.cutoffTime
                            }
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Confirmation Rules */}
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h5 className="font-bold text-blue-900 mb-4">
                              📞 Quy Định Xác Nhận
                            </h5>
                            <div className="space-y-4">
                              {carrierData.confirmationRules.map(
                                (rule, index) => (
                                  <div
                                    key={index}
                                    className="bg-white rounded-lg p-4 border-l-4 border-blue-500"
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-medium text-blue-800">
                                        Đặt: {rule.orderTime}
                                      </span>
                                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold">
                                        Deadline: {rule.mustConfirmBy}
                                      </span>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                      {rule.reason}
                                    </div>
                                    <div className="bg-gray-50 rounded p-2 text-sm">
                                      <strong>Ví dụ:</strong> {rule.example}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* Handover Rules */}
                          <div className="bg-green-50 rounded-lg p-4">
                            <h5 className="font-bold text-green-900 mb-4">
                              📦 Quy Định Bàn Giao
                            </h5>
                            <div className="space-y-4">
                              {carrierData.handoverRules.map((rule, index) => (
                                <div
                                  key={index}
                                  className="bg-white rounded-lg p-4 border-l-4 border-green-500"
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-green-800">
                                      Xác nhận: {rule.confirmTime}
                                    </span>
                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold">
                                      Deadline: {rule.mustHandoverBy}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-600 mb-1">
                                    Thời gian xử lý: {rule.processingTime}
                                  </div>
                                  <div className="bg-gray-50 rounded p-2 text-sm">
                                    <strong>Ví dụ:</strong> {rule.example}
                                  </div>
                                  {rule.specialNote && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2 text-sm text-yellow-800">
                                      <strong>⚠️ Lưu ý:</strong>{' '}
                                      {rule.specialNote}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )
            )}

            {/* Quick Reference Card */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">
                🎯 Tóm Tắt Nhanh - Móc Thời Gian Quan Trọng
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">
                    TikTok Shop (Nghiêm ngặt nhất):
                  </h4>
                  <ul className="text-orange-100 space-y-1 text-sm">
                    <li>• Đặt 8:00 → Xác nhận trước 10:00 → Bàn giao 15:00</li>
                    <li>• Đặt 16:00 → Xác nhận trước 18:00 → Bàn giao 21:00</li>
                    <li>
                      • Đặt 22:00 → Xác nhận 8:00 mai → Bàn giao 12:00 mai
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">
                    Shopee (Linh hoạt hơn):
                  </h4>
                  <ul className="text-orange-100 space-y-1 text-sm">
                    <li>
                      • Đặt 10:00 → Xác nhận trước 18:00 → Bàn giao 14:00 mai
                    </li>
                    <li>
                      • Đặt 16:00 → Xác nhận 12:00 mai → Bàn giao 15:00 mai
                    </li>
                    <li>• Vali cồng kềnh: thêm 1-2h processing time</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scenarios Tab */}
        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6" />
                <h3 className="text-2xl font-bold">
                  Kịch Bản Thực Tế Chi Tiết
                </h3>
              </div>
              <p className="text-green-100">
                Ví dụ cụ thể timeline từ đặt hàng đến giao hàng
              </p>
            </div>

            {realWorldScenarios.map((scenario, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {scenario.title}
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(scenario.platforms).map(
                    ([platform, data]) => (
                      <div
                        key={platform}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold text-gray-900 capitalize">
                            {platform === 'tiktok' ? 'TikTok Shop' : 'Shopee'}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              data.result.includes('✅')
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {data.result}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {data.timeline.map((step, stepIndex) => (
                            <div
                              key={stepIndex}
                              className="flex items-start gap-3"
                            >
                              <div className="w-16 text-sm font-mono text-gray-600 mt-1">
                                {step.time}
                              </div>
                              <div className="flex-1">
                                <div
                                  className={`inline-block px-2 py-1 rounded text-xs font-medium mb-1 ${getStatusColor(
                                    step.status
                                  )}`}
                                >
                                  {step.status.toUpperCase()}
                                </div>
                                <div className="text-sm text-gray-800">
                                  {step.action}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}

            {/* Best Practices */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                💡 Bài Học Từ Kịch Bản Thực Tế
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">
                    ✅ Thành công
                  </h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Xử lý đơn sáng sớm hiệu quả nhất</li>
                    <li>• J&T Express đáng tin cậy cho TikTok</li>
                    <li>• Buffer time quan trọng cho vali cồng kềnh</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    ⚠️ Cần cải thiện
                  </h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Đơn chiều có risk cao với TikTok</li>
                    <li>• Cần automation cho xác nhận nhanh</li>
                    <li>• Phải có backup plan khi quá cut-off</li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Tránh</h4>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Đừng để đơn TikTok qua 18:00 mới xử lý</li>
                    <li>• Không dùng Ninja Van cho đơn chiều</li>
                    <li>• Tránh xử lý manual trong giờ cao điểm</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Optimization Schedule */}
        {activeTab === 'optimization' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">
                Lịch Trình Tối Ưu Vận Hành
              </h3>
              <p className="text-blue-100">
                Phân bổ thời gian và nhà vận chuyển theo từng khung giờ
              </p>
            </div>

            <div className="grid gap-4">
              {optimizations.map((opt, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-bold text-lg">
                        {opt.time}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {opt.action}
                        </h4>
                        <p className="text-gray-600">{opt.reason}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                        opt.priority
                      )}`}
                    >
                      {opt.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 font-medium">
                      Nhà vận chuyển khuyến nghị:
                    </span>
                    <div className="flex gap-2">
                      {opt.carriers.map((carrier) => (
                        <span
                          key={carrier}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                        >
                          {carrier}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-green-800">
                  Khuyến Nghị Chính
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-800">
                    Ưu tiên hàng đầu:
                  </h4>
                  <ul className="text-green-700 space-y-1">
                    <li>• J&T Express cho TikTok Shop (100% on-time)</li>
                    <li>• Viettel Post cho Shopee (độ tin cậy 92%)</li>
                    <li>• GHTK cho hàng cồng kềnh (chi phí thấp)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-800">
                    Thời gian quan trọng:
                  </h4>
                  <ul className="text-green-700 space-y-1">
                    <li>• 14:00 - Cut-off chung cho hầu hết NVC</li>
                    <li>• 21:00 - Deadline cuối cùng (J&T)</li>
                    <li>• 07:00 - Bắt đầu xử lý đơn hàng</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts & Tracking Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Bell className="w-6 h-6" />
                <h3 className="text-2xl font-bold">
                  Cảnh Báo & Tracking Real-time
                </h3>
              </div>
              <p className="text-red-100">
                Theo dõi cut-off time và đơn hàng trễ
              </p>
            </div>

            {alerts.length > 0 ? (
              <div className="bg-white rounded-xl p-6 border border-red-200">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <h4 className="text-xl font-bold text-red-800">
                    Cảnh Báo Hiện Tại ({alerts.length})
                  </h4>
                </div>
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        alert.type === 'danger'
                          ? 'bg-red-50 border-red-500'
                          : 'bg-yellow-50 border-yellow-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertTriangle
                            className={`w-5 h-5 ${
                              alert.type === 'danger'
                                ? 'text-red-600'
                                : 'text-yellow-600'
                            }`}
                          />
                          <span
                            className={`font-medium ${
                              alert.type === 'danger'
                                ? 'text-red-800'
                                : 'text-yellow-800'
                            }`}
                          >
                            {alert.message}
                          </span>
                        </div>
                        <span
                          className={`text-sm px-2 py-1 rounded ${
                            alert.type === 'danger'
                              ? 'bg-red-200 text-red-800'
                              : 'bg-yellow-200 text-yellow-800'
                          }`}
                        >
                          {alert.carrier}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className="text-lg font-bold text-green-800">
                      Tất cả đều ổn!
                    </h4>
                    <p className="text-green-600">
                      Không có cảnh báo nào. Tất cả nhà vận chuyển đang hoạt
                      động bình thường.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Đơn Hàng Trễ Hôm Nay
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-red-600">
                      {lateOrdersReport.today.total}
                    </span>
                    <span className="text-gray-500">đơn hàng</span>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-700">
                      Theo nhà vận chuyển:
                    </h5>
                    {Object.entries(lateOrdersReport.today.byCarrier).map(
                      ([carrier, count]) => (
                        <div
                          key={carrier}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">{carrier}:</span>
                          <span className="font-medium text-red-600">
                            {count}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Theo Sàn
                </h4>
                <div className="space-y-3">
                  {Object.entries(lateOrdersReport.today.byPlatform).map(
                    ([platform, count]) => (
                      <div
                        key={platform}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium text-gray-700">
                          {platform}:
                        </span>
                        <span className="font-bold text-red-600">{count}</span>
                      </div>
                    )
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tuần này:</span>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {lateOrdersReport.thisWeek.total}
                      </div>
                      <div className="text-sm text-red-600">
                        {lateOrdersReport.thisWeek.trend}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Dự Kiến Thời Gian Hoàn Thành
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                {carriers.slice(0, 3).map((carrier, index) => {
                  const cutoffTime =
                    customCutoffs[carrier.name] || carrier.cutoffTime;
                  const timeLeft = getTimeUntilCutoff(cutoffTime);

                  return (
                    <div key={index} className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-3 h-3 rounded-full ${carrier.color}`}
                        ></div>
                        <span className="font-medium text-gray-900">
                          {carrier.name}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        Cut-off trong:
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {timeLeft}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Dự kiến giao: {carrier.hcmcDelivery}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Depots Tab */}
        {activeTab === 'depots' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-6 h-6" />
                <h3 className="text-2xl font-bold">
                  Bưu Cục & Kho Vận Chuyển Gần Nhất
                </h3>
              </div>
              <p className="text-green-100">
                Thông tin liên hệ và giờ làm việc
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearestDepots.map((depot, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        carriers.find((c) => c.name === depot.carrier)?.color ||
                        'bg-gray-400'
                      }`}
                    ></div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {depot.carrier}
                      </h4>
                      <p className="text-sm text-gray-600">{depot.name}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-700">{depot.address}</p>
                        <p className="text-xs text-blue-600 font-medium">
                          {depot.distance}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {depot.workingHours}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        Pickup cuối: {depot.lastPickup}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <a
                        href={`tel:${depot.phone}`}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center block"
                      >
                        📞 {depot.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Thao Tác Nhanh
              </h4>
              <div className="grid md:grid-cols-4 gap-4">
                <button className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="text-center">
                    <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">
                      Tìm đường
                    </p>
                  </div>
                </button>
                <button className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="text-center">
                    <Package className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">
                      Đặt lịch pickup
                    </p>
                  </div>
                </button>
                <button className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="text-center">
                    <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">
                      Xem giờ làm việc
                    </p>
                  </div>
                </button>
                <button className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="text-center">
                    <Truck className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">
                      Theo dõi xe
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingSLAComparison;
