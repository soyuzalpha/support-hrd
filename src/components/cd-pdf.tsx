import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingBottom: 60,
  },
  header: {
    backgroundColor: "#7B091F",
    color: "white",
    padding: 30,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e2e8f0",
    marginBottom: 15,
  },
  headerInfo: {
    flexDirection: "row",
    gap: 15,
    fontSize: 9,
    color: "#cbd5e1",
  },
  content: {
    paddingHorizontal: 40,
    paddingTop: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: "#cbd5e1",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  gridItem: {
    width: "48%",
    marginBottom: 10,
  },
  gridItemFull: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    color: "#64748b",
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 2,
  },
  value: {
    color: "#1e293b",
    fontSize: 10,
  },
  historyItem: {
    borderLeftWidth: 3,
    borderLeftColor: "#cbd5e1",
    paddingLeft: 12,
    marginBottom: 15,
  },
  historyTitle: {
    fontWeight: "bold",
    color: "#1e293b",
    fontSize: 11,
    marginBottom: 4,
  },
  historySubtitle: {
    color: "#475569",
    fontSize: 9,
    marginBottom: 4,
  },
  historyDate: {
    color: "#64748b",
    fontSize: 9,
    marginBottom: 4,
  },
  historyDescription: {
    color: "#475569",
    fontSize: 9,
    marginTop: 4,
  },
  leaveQuotaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
  },
  leaveQuotaName: {
    fontWeight: "bold",
    color: "#1e293b",
    fontSize: 10,
  },
  leaveQuotaValue: {
    color: "#475569",
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#64748b",
  },
  documentSection: {
    marginTop: 20,
  },
  documentItem: {
    marginBottom: 15,
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  documentHeader: {
    backgroundColor: "#f1f5f9",
    padding: 8,
  },
  documentType: {
    fontWeight: "bold",
    color: "#1e293b",
    fontSize: 10,
  },
  documentImage: {
    padding: 10,
  },
  image: {
    width: "100%",
    maxHeight: 400,
    objectFit: "contain",
  },
});

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

export default function CvPdfDocument({ userData }) {
  return (
    <Document>
      {/* Main Page */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{userData.employees.full_name}</Text>
          <Text style={styles.headerSubtitle}>
            {userData.position.name_position} - {userData.division.name_division}
          </Text>
          <View style={styles.headerInfo}>
            <Text>{userData.email}</Text>
            <Text>{userData.employees.contacts[0]?.phone_number}</Text>
            <Text>{userData.employee_number}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Full Name</Text>
                <Text style={styles.value}>{userData.employees.full_name}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>NIK</Text>
                <Text style={styles.value}>{userData.employees.nik}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Birth Place & Date</Text>
                <Text style={styles.value}>
                  {userData.employees.birth_place}, {formatDate(userData.employees.birth_date)}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Age</Text>
                <Text style={styles.value}>{userData.employees.age} years</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Gender</Text>
                <Text style={styles.value}>{userData.employees.gender}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Blood Type</Text>
                <Text style={styles.value}>{userData.employees.blood_type}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Religion</Text>
                <Text style={styles.value}>{userData.employees.religion}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Marital Status</Text>
                <Text style={styles.value}>{userData.employees.marital_status}</Text>
              </View>
              <View style={styles.gridItemFull}>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>
                  {userData.employees.address}, {userData.employees.city.city_name},{" "}
                  {userData.employees.province.province_name} {userData.employees.postal_code}
                </Text>
              </View>
            </View>
          </View>

          {/* Employment Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Employment Details</Text>
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Company</Text>
                <Text style={styles.value}>{userData.company.name_company}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Position</Text>
                <Text style={styles.value}>{userData.position.name_position}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Division</Text>
                <Text style={styles.value}>{userData.division.name_division}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Employment Status</Text>
                <Text style={styles.value}>{userData.employments.employment_status}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Join Date</Text>
                <Text style={styles.value}>{formatDate(userData.employments.join_date)}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Work Duration</Text>
                <Text style={styles.value}>{userData.employments.work_duration}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Work Location</Text>
                <Text style={styles.value}>{userData.employments.work_location}</Text>
              </View>
            </View>
          </View>

          {/* Emergency Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            {userData.employees.family.map((member, index) => (
              <View key={index} style={styles.grid}>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Name</Text>
                  <Text style={styles.value}>{member.name_family}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Relationship</Text>
                  <Text style={styles.value}>{member.relationship.replace("_", " ")}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Phone Number</Text>
                  <Text style={styles.value}>{member.phone_number}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Education History */}
          {userData.employees.educationhistory && userData.employees.educationhistory.length > 0 && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>Education History</Text>
              {userData.employees.educationhistory.map((edu, index) => (
                <View key={index} style={styles.historyItem} wrap={false}>
                  <Text style={styles.historyTitle}>
                    {edu.degree.name_degree} - {edu.studyprogram.program_name}
                  </Text>
                  <Text style={styles.historySubtitle}>{edu.school.school_name}</Text>
                  <Text style={styles.historyDate}>
                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                  </Text>
                  {edu.responsibilities && <Text style={styles.historyDescription}>{edu.responsibilities}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Work History */}
          {userData.employees.workhistory && userData.employees.workhistory.length > 0 && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>Work History</Text>
              {userData.employees.workhistory.map((work, index) => (
                <View key={index} style={styles.historyItem} wrap={false}>
                  <Text style={styles.historyTitle}>{work.position}</Text>
                  <Text style={styles.historySubtitle}>
                    {work.company_name} - {work.division}
                  </Text>
                  <Text style={styles.historyDate}>
                    {formatDate(work.start_date)} - {formatDate(work.end_date)}
                  </Text>
                  {work.responsibilities && <Text style={styles.historyDescription}>{work.responsibilities}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Leave Quota */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Leave Quota ({userData.leave_quotas[0]?.year})</Text>
            {userData.leave_quotas.map((quota, index) => (
              <View key={index} style={styles.leaveQuotaItem}>
                <Text style={styles.leaveQuotaName}>{quota.typeleave.name_typeleave}</Text>
                <Text style={styles.leaveQuotaValue}>
                  {quota.remaining_days} / {quota.total_days} days remaining
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </Text>
      </Page>

      {/* Documents Page */}
      {userData.employees.documents.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Documents</Text>
            <View style={styles.documentSection}>
              {userData.employees.documents.map((doc, index) => (
                <View key={index} style={styles.documentItem}>
                  <View style={styles.documentHeader}>
                    <Text style={styles.documentType}>{doc.document_type}</Text>
                  </View>
                  <View style={styles.documentImage}>
                    <Image src={doc.url} style={styles.image} />
                  </View>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.footer}>
            Generated on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </Text>
        </Page>
      )}
    </Document>
  );
}
