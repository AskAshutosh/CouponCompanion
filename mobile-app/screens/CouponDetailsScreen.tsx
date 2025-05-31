import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Button,
  Chip,
  IconButton,
} from 'react-native-paper';
import { useCouponContext } from '../context/CouponContext';
import { copyToClipboard } from '../services/ClipboardService';
import { Coupon } from '../types';

interface CouponDetailsScreenProps {
  route: {
    params: {
      coupon: Coupon;
    };
  };
  navigation: any;
}

const CouponDetailsScreen: React.FC<CouponDetailsScreenProps> = ({ route, navigation }) => {
  const { coupon } = route.params;
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
          onPress: () => {
            deleteCoupon(coupon.id);
            navigation.goBack();
          },
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
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text style={styles.storeName}>{coupon.storeName}</Text>
            <IconButton
              icon="delete"
              size={24}
              onPress={handleDelete}
              iconColor="#dc3545"
            />
          </View>

          <Chip mode="outlined" style={styles.categoryChip}>
            {coupon.category}
          </Chip>

          <View style={styles.codeSection}>
            <Text style={styles.codeLabel}>Coupon Code</Text>
            <View style={styles.codeContainer}>
              <Text style={styles.code}>{coupon.code}</Text>
              <Button
                mode="contained"
                onPress={handleCopy}
                icon="content-copy"
                style={styles.copyButton}
                compact
              >
                Copy
              </Button>
            </View>
          </View>

          {coupon.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{coupon.description}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <Text style={[styles.status, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>

          {coupon.expiryDate && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Expiry Date</Text>
              <Text style={styles.expiryDate}>
                {new Date(coupon.expiryDate).toLocaleDateString()}
              </Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Created</Text>
            <Text style={styles.createdDate}>
              {new Date(coupon.createdAt).toLocaleDateString()}
            </Text>
          </View>

          {coupon.detectedFrom && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detected From</Text>
              <Text style={styles.detectedInfo}>
                {coupon.detectedFrom.url || coupon.detectedFrom.appName || 'Unknown source'}
              </Text>
              <Text style={styles.confidenceText}>
                Confidence: {Math.round(coupon.detectedFrom.confidence * 100)}%
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  codeSection: {
    marginBottom: 24,
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  code: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: '#333',
    flex: 1,
  },
  copyButton: {
    marginLeft: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  expiryDate: {
    fontSize: 14,
    color: '#666',
  },
  createdDate: {
    fontSize: 14,
    color: '#666',
  },
  detectedInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  confidenceText: {
    fontSize: 12,
    color: '#999',
  },
});

export default CouponDetailsScreen;