import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card, IconButton, Chip } from 'react-native-paper';
import { Coupon, CouponStatus } from '../types';
import { copyToClipboard } from '../services/ClipboardService';
import { useCouponContext } from '../context/CouponContext';

interface CouponCardProps {
  coupon: Coupon;
  onPress?: () => void;
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon, onPress }) => {
  const { deleteCoupon } = useCouponContext();

  const handleCopy = async () => {
    await copyToClipboard(coupon.code);
    Alert.alert('Copied!', 'Coupon code copied to clipboard');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Coupon',
      'Are you sure you want to delete this coupon?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCoupon(coupon.id),
        },
      ]
    );
  };

  const getStatusColor = (): string => {
    if (coupon.isExpired) return '#dc3545';
    if (coupon.daysUntilExpiry !== undefined && coupon.daysUntilExpiry <= 7) {
      return '#ff8800';
    }
    return '#28a745';
  };

  const getStatusText = (): string => {
    if (coupon.isExpired) return 'Expired';
    if (coupon.daysUntilExpiry !== undefined) {
      if (coupon.daysUntilExpiry === 0) return 'Expires today!';
      if (coupon.daysUntilExpiry === 1) return 'Expires tomorrow';
      if (coupon.daysUntilExpiry <= 7) return `Expires in ${coupon.daysUntilExpiry} days`;
    }
    return 'Active';
  };

  return (
    <Card style={[styles.card, coupon.isExpired && styles.expiredCard]}>
      <TouchableOpacity onPress={onPress} style={styles.cardContent}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>{coupon.storeName}</Text>
              <Chip mode="outlined" style={styles.categoryChip} compact>
                {coupon.category}
              </Chip>
            </View>
            <View style={styles.actions}>
              <IconButton
                icon="content-copy"
                size={20}
                onPress={handleCopy}
                iconColor="#007bff"
              />
              <IconButton
                icon="delete"
                size={20}
                onPress={handleDelete}
                iconColor="#dc3545"
              />
            </View>
          </View>

          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Code:</Text>
            <Text style={styles.code}>{coupon.code}</Text>
          </View>

          {coupon.description && (
            <Text style={styles.description}>{coupon.description}</Text>
          )}

          <View style={styles.footer}>
            <Text style={[styles.status, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
            {coupon.expiryDate && (
              <Text style={styles.expiryDate}>
                Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
              </Text>
            )}
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
    backgroundColor: '#ffffff',
  },
  expiredCard: {
    opacity: 0.7,
    backgroundColor: '#f8f9fa',
  },
  cardContent: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryChip: {
    alignSelf: 'flex-start',
  },
  actions: {
    flexDirection: 'row',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
  },
  codeLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  code: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: '#333',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  expiryDate: {
    fontSize: 12,
    color: '#666',
  },
});

export default CouponCard;