import React, { useState, useEffect, useCallback } from "react";
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
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function UpdateEmployee() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { apiCall } = useApi();
  const data = params.data ? JSON.parse(params.data) : {};
  const id = data?.id || "";
  
  const [formData, setFormData] = useState({
    name: data?.name || "",
    email: data?.email || "",
    phone: data?.phone || "",
    dob: data?.dob || "",
    address: data?.address || "",
    position: data?.position || "",
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

  // Handle update
  const handleUpdate = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert("Tất cả các trường đều bắt buộc!");
      return;
    }

    setLoading(true);
    try {
      await apiCall.updateEmployee(id, formData);
      Alert.alert("Cập nhật nhân viên thành công!");
      router.push("/");
    } catch (error: any) {
      Alert.alert("Lỗi cập nhật nhân viên", error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [formData, id, router]);

  // Handle delete
  const handleDelete = () => {
    Alert.alert(
      "Xoá nhân viên",
      "Bạn có chắc chắn muốn xoá nhân viên này?",
      [
        {
          text: "Huỷ",
          style: "cancel",
        },
        {
          text: "Xoá",
          onPress: async () => {
            setLoading(true);
            try {
              await apiCall.deleteEmployee(id);
              Alert.alert("Xoá nhân viên thành công");
              router.push("/");
            } catch (error: any) {
              Alert.alert("Lỗi xoá nhân viên", error.message || "An error occurred");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    // Set headerRight button to trigger the delete
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="person-remove" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleDelete]);

  // Handle date picker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date(formData.dob);
    const formattedDate = currentDate.toISOString().split("T")[0];
    handleInputChange("dob", formattedDate);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Họ tên</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={formData.name}
          onChangeText={(text) => handleInputChange("name", text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Email</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => handleInputChange("email", text)}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Số điện thoại</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          value={formData.phone}
          onChangeText={(text) => handleInputChange("phone", text)}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Ngày sinh</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Ngày sinh"
          value={formData.dob}
          onFocus={() => setShowDatePicker(true)}
          editable={false}
        />
          <DateTimePicker
          value={new Date(formData.dob) || new Date()}
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
        <Button title="Cập nhật" onPress={handleUpdate} />
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
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  label: {
    marginRight: 8,
    fontWeight: "bold",
    width: 120, // You can adjust the width as needed
  },
});
