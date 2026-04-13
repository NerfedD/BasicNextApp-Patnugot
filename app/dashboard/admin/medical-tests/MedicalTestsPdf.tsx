// app/dashboard/admin/medical-tests/MedicalTestsPdf.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { MedicalTest } from './actions';

// Styles for A4 PDF layout
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
    header: { fontSize: 18, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
    table: { display: "flex", width: "auto", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
    tableRow: { margin: "auto", flexDirection: "row" },
    tableColHeader: { width: "25%", borderStyle: "solid", borderBottomWidth: 1, borderRightWidth: 1, backgroundColor: '#f3f4f6', padding: 8 },
    tableCol: { width: "25%", borderStyle: "solid", borderBottomWidth: 1, borderRightWidth: 1, padding: 8 },
    tableCellHeader: { margin: "auto", fontWeight: "bold", fontSize: 11 },
    tableCell: { margin: "auto" }
});

export const MedicalTestsPdf = ({ tests }: { tests: MedicalTest[] }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>Medical Tests Master List</Text>
            <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableRow}>
                    <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Test Name</Text></View>
                    <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Category</Text></View>
                    <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Unit</Text></View>
                    <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Range</Text></View>
                </View>
                {/* Table Rows */}
                {tests.map((test) => (
                    <View style={styles.tableRow} key={test.id}>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>{test.name}</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>{test.category_name}</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>{test.uom_name}</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>{test.normalmin} - {test.normalmax}</Text></View>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);