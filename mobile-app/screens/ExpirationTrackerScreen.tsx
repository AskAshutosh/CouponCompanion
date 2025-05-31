import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Card, IconButton, Chip } from 'react-native-paper';
import { useCouponContext } from '../context/CouponContext';
import { Coupon } from '../types';

interface ExpirationTrackerScreenProps {
  navigation: any;
}

const ExpirationTrackerScreen: React.FC<ExpirationTrackerScreenProps> = ({ navigation }) => {
  const { getExpiredCoupons, getExpiringSoonCoupons, deleteCoupon } = useCouponContext();
  
  const expiredCoupons = getExpiredCoupons();
  const expiringSoonCoupons = getExpiringSoonCoupons(7);

  const getStatusColor = (coupon: Coupon): string => {
    if (coupon.isExpired) return '#dc3545';
    if (coupon.daysUntilExpiry !== undefined && coupon.daysUntilExpiry <= 7) {
      return '#ff8800';
    }
    return '#28a745';
  };

  const getStatusText = (coupon: Coupon): string => {
    if (coupon.isExpired) return 'Expired';
    if (coupon.daysUntilExpiry !== undefined) {
      if (coupon.daysUntilExpiry === 0) return 'Expires today!';
      if (coupon.daysUntilExpiry === 1) return 'Expires tomorrow';
      return `Expires in ${coupon.daysUntilExpiry} days`;
    }
    return 'Active';
  };

  const renderCoupon = ({ item }: { item: Coupon }) => (
    <Card style={[styles.couponCard, item.isExpired && styles.expiredCard]}>
      <Card.Content>
        <View style={styles.couponHeader}>
          <View style={styles.couponInfo}>
            <Text style={styles.storeName}>{item.storeName}</Text>
            <Chip mode="outlined" compact style={styles.codeChip}>
              {item.code}
            </Chip>
          </View>
          <IconButton
            icon="delete"
            size={20}
            onPress={() => deleteCoupon(item.id)}
            iconColor="#dc3545"
          />
        </View>
        <Text style={[styles.status, { color: getStatusColor(item) }]}>
          {getStatusText(item)}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {expiringSoonCoupons.length > 0 && (
        <View style={styles.section}>
          <Card style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <IconButton icon="clock-alert" iconColor="#ff8800" size={24} />
                <Text style={styles.sectionTitle}>
                  Expiring Soon ({expiringSoonCoupons.length})
                </Text>
              </View>
            </Card.Content>
          </Card>
          <FlatList
            data={expiringSoonCoupons}
            renderItem={renderCoupon}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {expiredCoupons.length > 0 && (
        <View style={styles.section}>
          <Card style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <IconButton icon="clock-remove" iconColor="#dc3545" size={24} />
                <Text style={styles.sectionTitle}>
                  Expired ({expiredCoupons.length})
                </Text>
              </View>
            </Card.Content>
          </Card>
          <FlatList
            data={expiredCoupons}
            renderItem={renderCoupon}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {expiredCoupons.length === 0 && expiringSoonCoupons.length === 0 && (
        <View style={styles.emptyContainer}>
          <IconButton icon="check-circle" iconColor="#4CAF50" size={64} />
          <Text style={styles.emptyTitle}>All coupons are active!</Text>
          <Text style={styles.emptySubtitle}>No expiration issues found.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionCard: {
    marginBottom: 12,
    backgroundColor: '#fff3cd',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#856404',
  },
  couponCard: {
    marginBottom: 8,
    elevation: 2,
  },
  expiredCard: {
    opacity: 0.7,
    backgroundColor: '#f8f9fa',
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  couponInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  codeChip: {
    alignSelf: 'flex-start',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ExpirationTrackerScreen;