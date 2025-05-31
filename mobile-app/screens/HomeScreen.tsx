import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Searchbar, FAB, Card, Chip, IconButton } from 'react-native-paper';
import { useCouponContext } from '../context/CouponContext';
import { Coupon } from '../types';
import CouponCard from '../components/CouponCard';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const {
    coupons,
    searchCoupons,
    getCategories,
    getExpiredCoupons,
    getExpiringSoonCoupons,
  } = useCouponContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    setCategories(getCategories());
    setFilteredCoupons(coupons);
  }, [coupons]);

  useEffect(() => {
    let filtered = coupons;
    
    if (searchQuery) {
      filtered = searchCoupons(searchQuery);
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(coupon => coupon.category === selectedCategory);
    }
    
    setFilteredCoupons(filtered);
  }, [searchQuery, selectedCategory, coupons]);

  const expiredCount = getExpiredCoupons().length;
  const expiringSoonCount = getExpiringSoonCoupons().length;

  const clearCategory = () => {
    setSelectedCategory(null);
  };

  const renderCoupon = ({ item }: { item: Coupon }) => (
    <CouponCard
      coupon={item}
      onPress={() => navigation.navigate('CouponDetails', { coupon: item })}
    />
  );

  const renderCategory = ({ item }: { item: string }) => (
    <Chip
      mode={selectedCategory === item ? 'flat' : 'outlined'}
      selected={selectedCategory === item}
      onPress={() => setSelectedCategory(item)}
      style={styles.categoryChip}
    >
      {item}
    </Chip>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search coupons..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      {(expiredCount > 0 || expiringSoonCount > 0) && (
        <Card style={styles.alertCard}>
          <Card.Content>
            <View style={styles.alertContent}>
              {expiringSoonCount > 0 && (
                <TouchableOpacity
                  style={styles.alertItem}
                  onPress={() => navigation.navigate('ExpirationTracker')}
                >
                  <IconButton icon="clock-alert" iconColor="#ff8800" size={20} />
                  <Text style={styles.alertText}>
                    {expiringSoonCount} expiring soon
                  </Text>
                </TouchableOpacity>
              )}
              
              {expiredCount > 0 && (
                <TouchableOpacity
                  style={styles.alertItem}
                  onPress={() => navigation.navigate('ExpirationTracker')}
                >
                  <IconButton icon="clock-remove" iconColor="#dc3545" size={20} />
                  <Text style={styles.alertText}>
                    {expiredCount} expired
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Card.Content>
        </Card>
      )}

      {categories.length > 0 && (
        <View style={styles.categoriesContainer}>
          <Text style={styles.categoriesTitle}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesList}
          />
          {selectedCategory && (
            <TouchableOpacity onPress={clearCategory} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear filter</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={filteredCoupons}
        renderItem={renderCoupon}
        keyExtractor={(item) => item.id}
        style={styles.couponsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No coupons found</Text>
            <Text style={styles.emptySubText}>
              Tap the + button to add your first coupon
            </Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddCoupon')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  alertCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#fff3cd',
  },
  alertContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#856404',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  categoriesList: {
    marginBottom: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  clearButton: {
    alignSelf: 'flex-start',
  },
  clearButtonText: {
    color: '#007bff',
    fontSize: 14,
  },
  couponsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ea',
  },
});

export default HomeScreen;