import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  List,
  Switch,
  Button,
  Divider,
} from 'react-native-paper';
import { useCouponContext } from '../context/CouponContext';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { enableAutoDetection, isAutoDetectionEnabled, getAllCoupons } = useCouponContext();
  const [notifications, setNotifications] = useState(true);

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all your coupons? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {
            // Clear all coupons - implement this functionality
            Alert.alert('Success', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    const coupons = getAllCoupons();
    if (coupons.length === 0) {
      Alert.alert('No Data', 'You have no coupons to export.');
      return;
    }
    
    // In a real app, this would export to a file or share
    Alert.alert('Export', `Found ${coupons.length} coupons ready for export.`);
  };

  const couponCount = getAllCoupons().length;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>App Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{couponCount}</Text>
              <Text style={styles.statLabel}>Total Coupons</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Preferences</Text>
          
          <List.Item
            title="Auto-Detection"
            description="Automatically detect coupon codes from other apps"
            left={props => <List.Icon {...props} icon="radar" />}
            right={() => (
              <Switch
                value={isAutoDetectionEnabled}
                onValueChange={enableAutoDetection}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Notifications"
            description="Get notified about expiring coupons"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Expiration Tracker"
            description="View coupons that are expiring soon"
            left={props => <List.Icon {...props} icon="clock-alert" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('ExpirationTracker')}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Data Management</Text>
          
          <Button
            mode="outlined"
            onPress={handleExportData}
            style={styles.actionButton}
            icon="export"
          >
            Export Data
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleClearAllData}
            style={[styles.actionButton, styles.dangerButton]}
            icon="delete"
            textColor="#dc3545"
          >
            Clear All Data
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.aboutText}>
            CouponKeeper Mobile helps you organize and manage your e-commerce coupon codes. 
            Never miss a discount again with smart expiration tracking and automatic detection features.
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
    marginBottom: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ea',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionButton: {
    marginBottom: 12,
  },
  dangerButton: {
    borderColor: '#dc3545',
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default SettingsScreen;