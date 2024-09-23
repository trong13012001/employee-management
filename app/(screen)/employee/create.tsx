import React, { useState, useCallback } from "react";
import {
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useApi } from "../../api";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CreateEmployee() {
  const router = useRouter();
  const { apiCall } = useApi();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    position: "",
  });

  const [loading, setLoading] = useState(false);

  // Input change handler
  const handleInputChange = (field: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Validators
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const validateDOB = (dob: string) => {
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dobRegex.test(dob);
  };

  const validateForm = useCallback(() => {
    const { name, email, phone, dob, address, position } = formData;
    if (!name || !email || !phone || !dob || !address || !position) return false;
    if (!validateEmail(email)) {
      Alert.alert("Email không hợp lệ!");
      return false;
    }
    if (!validatePhone(phone)) {
      Alert.alert("Số điện thoại không hợp lệ!");
      return false;
    }
    if (!validateDOB(dob)) {
      Alert.alert("Ngày sinh không hợp lệ! Định dạng: YYYY-MM-DD");
      return false;
    }
    return true;
  }, [formData]);

  // Handle create
  const handleCreate = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert("Tất cả các trường đều bắt buộc!");
      return;
    }

    setLoading(true);
    try {
      console.log("formData", formData);
      await apiCall.createEmployee(formData);
      Alert.alert("Thêm nhân viên thành công!");
      router.push("/");
    } catch (error: any) {
      Alert.alert("Lỗi tạo nhân viên", error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [formData, router]);

  // Handle date picker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    handleInputChange("dob", formattedDate);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Họ tên</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Nhập họ tên"
          value={formData.name}
          onChangeText={(text) => handleInputChange("name", text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Email</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Nhập email"
          value={formData.email}
          onChangeText={(text) => handleInputChange("email", text)}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Số điện thoại</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          value={formData.phone}
          onChangeText={(text) => handleInputChange("phone", text)}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Ngày sinh</ThemedText>
 
          <View pointerEvents="none">
            <TextInput
              style={styles.input}
              placeholder="Ngày sinh"
              value={formData.dob}
              editable={false}
            />
          </View>
        <DateTimePicker
        value={formData.dob ? new Date(formData.dob) : new Date()} // Ensure valid date
        mode="date"
        display="default"
        onChange={handleDateChange}
      />
      
      </View>



      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Địa chỉ</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={formData.address}
          onChangeText={(text) => handleInputChange("address", text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Vị trí</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Position"
          value={formData.position}
          onChangeText={(text) => handleInputChange("position", text)}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Thêm nhân viên" onPress={handleCreate} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    height: 40,

    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  label: {
    marginRight: 8,
    fontWeight: "bold",
    width: 100,
  },

});
