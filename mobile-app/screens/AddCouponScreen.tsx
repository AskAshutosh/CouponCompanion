import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Chip,
  Switch,
} from 'react-native-paper';
import { useCouponContext } from '../context/CouponContext';

interface AddCouponScreenProps {
  navigation: any;
}

const AddCouponScreen: React.FC<AddCouponScreenProps> = ({ navigation }) => {
  const { addCoupon, getCategories } = useCouponContext();
  const existingCategories = getCategories();
  
  const [formData, setFormData] = useState({
    storeName: '',
    category: '',
    code: '',
    description: '',
    expiryDate: '',
    newCategory: '',
  });
  
  const [useNewCategory, setUseNewCategory] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.storeName.trim()) {
      Alert.alert('Error', 'Please enter a store name');
      return;
    }
    
    if (!formData.code.trim()) {
      Alert.alert('Error', 'Please enter a coupon code');
      return;
    }
    
    const categoryToUse = useNewCategory && formData.newCategory.trim()
      ? formData.newCategory.trim()
      : formData.category || 'General';

    try {
      await addCoupon({
        storeName: formData.storeName.trim(),
        category: categoryToUse,
        code: formData.code.trim(),
        description: formData.description.trim(),
        expiryDate: formData.expiryDate || undefined,
      });
      
      Alert.alert('Success', 'Coupon added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add coupon. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.formCard}>
        <Card.Content>
          <Text style={styles.title}>Add New Coupon</Text>
          
          <TextInput
            label="Store Name"
            value={formData.storeName}
            onChangeText={(value) => handleInputChange('storeName', value)}
            style={styles.input}
            mode="outlined"
            required
          />
          
          <TextInput
            label="Coupon Code"
            value={formData.code}
            onChangeText={(value) => handleInputChange('code', value)}
            style={styles.input}
            mode="outlined"
            required
          />
          
          <TextInput
            label="Description (Optional)"
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
          />
          
          <TextInput
            label="Expiry Date (YYYY-MM-DD)"
            value={formData.expiryDate}
            onChangeText={(value) => handleInputChange('expiryDate', value)}
            style={styles.input}
            mode="outlined"
            placeholder="2024-12-31"
          />
          
          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>Category</Text>
            
            <View style={styles.switchContainer}>
              <Text>Create new category</Text>
              <Switch
                value={useNewCategory}
                onValueChange={setUseNewCategory}
              />
            </View>
            
            {useNewCategory ? (
              <TextInput
                label="New Category"
                value={formData.newCategory}
                onChangeText={(value) => handleInputChange('newCategory', value)}
                style={styles.input}
                mode="outlined"
              />
            ) : (
              <View style={styles.categoriesContainer}>
                {existingCategories.length > 0 ? (
                  existingCategories.map((category) => (
                    <Chip
                      key={category}
                      mode={formData.category === category ? 'flat' : 'outlined'}
                      selected={formData.category === category}
                      onPress={() => handleInputChange('category', category)}
                      style={styles.categoryChip}
                    >
                      {category}
                    </Chip>
                  ))
                ) : (
                  <Text style={styles.noCategoriesText}>
                    No categories yet. Create your first category above.
                  </Text>
                )}
              </View>
            )}
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={[styles.button, styles.cancelButton]}
            >
              Cancel
            </Button>
            
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={[styles.button, styles.submitButton]}
            >
              Add Coupon
            </Button>
          </View>
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
  formCard: {
    margin: 16,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  categorySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  noCategoriesText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    borderColor: '#dc3545',
  },
  submitButton: {
    backgroundColor: '#6200ea',
  },
});

export default AddCouponScreen;