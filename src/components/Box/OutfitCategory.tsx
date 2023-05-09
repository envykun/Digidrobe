// import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
// import { SimpleLineIcons } from "@expo/vector-icons";
// import { Item } from "src/classes/Item";
// import { Category } from "@Models/Category";
// import BottomSheetCard from "@Components/Modal/BottomSheetCard";
// import { Outfit } from "src/classes/Outfit";

// export interface OutfitCategoryProp {
//   category: Category;
//   items: Map<string, Item>;
//   deleteCategory?: () => void;
//   addItem?: () => void;
//   outfit?: Outfit;
// }

// export default function OutfitCategory({ category, items, deleteCategory, addItem, outfit }: OutfitCategoryProp) {
//   return (
//     <View style={styles.categoryContainer}>
//       <View style={styles.header}>
//         <Text>{category.label}</Text>
//         <TouchableOpacity onPress={deleteCategory}>
//           <SimpleLineIcons name="close" size={20} color="black" />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.rowContainer}>
//         {items &&
//           Array.from(items.values()).map((child) => (
//             <View key={child.uuid} style={styles.itemContainer}>
//               <BottomSheetCard
//                 label={child.name}
//                 imageURL={child.getImage()}
//                 onPress={() => outfit?.removeItemFromCategory(category.id, child.uuid)}
//               />
//             </View>
//           ))}
//         <View style={[styles.itemContainer, styles.addIcon]}>
//           <TouchableOpacity onPress={addItem}>
//             <SimpleLineIcons name="plus" size={32} color="black" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   rowContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   itemContainer: {
//     aspectRatio: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     width: "31.782%", // TODO: Fix this
//   },
//   addIcon: {
//     elevation: 3,
//     borderRadius: 8,
//     backgroundColor: "white",
//   },
//   categoryContainer: {
//     borderRadius: 8,
//     elevation: 3,
//     padding: 12,
//     backgroundColor: "white",
//     gap: 8,
//   },
// });
