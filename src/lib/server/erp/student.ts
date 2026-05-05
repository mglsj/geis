import type { Cookies } from "@sveltejs/kit";
import { fetchGEU } from "./api";

// Raw Data
// {
//   '10': '93.6',
//   RegID: 86700,
//   StudentID: '220112809',
//   EnrollmentNo: 'PV-22940038',
//   StudentName: 'LAKSHYAJEET SINGH JALAL ',
//   Photo: null,
//   FatherHusName: 'MOHIT JALAL',
//   MotherName: 'PURNIMA JALAL',
//   College: 'GEHU-Haldwani Campus',
//   Course: 'BACHELOR OF TECHNOLOGY',
//   CourseSpecialization: '',
//   Univesity: 'Graphic Era Hill University',
//   DOB: '26/02/2005',
//   YearSem: 8,
//   IsAffidavitSubmit: 0,
//   IsWinningPrgSubmit: 0,
//   studentEnquirySession: false,
//   YS: 'Semester',
//   Gender: 'Male',
//   MaritalStatus: 'Unmarried',
//   CourseType: 'UG',
//   Branch: 'B.Tech (CSE)',
//   Section: '8A',
//   Email: 'LAKSHYAJEETJALAL@GMAIL.COM',
//   OfficialMailID: 'LAKSHYAJEETSINGHJALAL.220112809@gehu.ac.in',
//   MobileNO: '9412130016',
//   AlternateMobileNO: '',
//   FOccupation: 'SERVICE',
//   MOccupation: 'HOUSEWIFE',
//   FMobileNo: '9719233135',
//   MMobileNo: '9759094329',
//   FDept: '',
//   MDept: '',
//   AwardFirst: '',
//   AwLevelFirst: '',
//   AwNDFirst: '',
//   '10+2': '94.8',
//   Graduation: '',
//   PRollNo: '2294038',
//   RegisDate: '02/09/2022',
//   Mentor: '  ',
//   MentorContact: '',
//   MentorEmail: '',
//   PAddress: 'SANGAM VIHAR PHASE 2, Near S-Bend Gas Godam Road, CHARRAYALNAYAK, HALDWANI, NAINITAL, Uttarakhand - 263139,Nainital,Uttarakhand,India',
//   CAddress: 'SANGAM VIHAR PHASE 2, Near S-Bend Gas Godam Road, CHARRAYALNAYAK, HALDWANI, NAINITAL, Uttarakhand - 263139,Nainital,Uttarakhand,India',
//   Hostel: '',
//   Route: '',
//   BloodGroup: '',
//   StudentType: 'Regular',
//   LateEntry: 'No',
//   CollegeID: 4,
//   CourseID: 1,
//   NADID: '',
//   IsNewStudent: 0,
//   IsApply: 1,
//   OfficialMailID1: 'LAKSHYAJEETSINGHJALAL.220112809@gehu.ac.in',
//   IsOnlineOfflineMode: 0,
//   IsHostelTransportMode: 0,
//   IsOnlyTransportMode: 0,
//   IsClassModeSelected: 0,
//   ClassMode: '',
//   IsTravelDetail: 0,
//   IsAccomodation: 0,
//   IsHostelDues: 0,
//   UniversityID: 2,
//   SecondPopupShowHide: 1,
//   IsMobileVerify: 1,
//   IsEmailVerify: 0,
//   IsEmailOtpVerify: 1,
//   IsEnrollFormSubmit: 1,
//   ClassRollNo: 0,
//   Batch: 2022,
//   PromotedBatch: 2025,
//   ElectiveOpt: 0,
//   InternationalDocument: 0,
//   WorkShop: 0,
//   ABCAccountNo: '748368230772',
//   UpdatePhoto: true,
//   TAddress: 'SANGAM VIHAR PHASE 2, Near S-Bend Gas Godam Road, CHARRAYALNAYAK, HALDWANI, NAINITAL, Uttarakhand - 263139',
//   TCountry: 1,
//   TState: 2,
//   TDistrict: 535,
//   TTahsil: 487,
//   TPinCode: '263139',
//   FestURL: '',
//   IAffidevid: 1,
//   IsUndertakingAtt: 1,
//   DeclarationCheck: 0,
//   stumaxPromoSYID: 28,
//   StudentStatus: 'Active',
//   TalwinderPass: 'YES'
// }

interface StudentProfile {
	studentId: string;
	enrollmentNumber: string;
	rollNumber: string;
	name: string;
	college?: string;
	university: string;
	course: string;
	specialization?: string;
	dob: string;
	yearSem: number;
	gender: string;
	courseType: string;
	branch?: string;
	officialEmail: string;
	personalEmail: string;
	mobile: string;
	batch: number;
	abcAccount?: string;
	address: string;
	section?: string;
}

function parseStudentProfile(data: any): StudentProfile {
	return {
		studentId: data.StudentID,
		enrollmentNumber: data.EnrollmentNo,
		rollNumber: data.PRollNo,
		name: data.StudentName.trim(),
		college: data.College,
		university: data.Univesity, // Note: "Univesity" is a typo in the original data, but we keep it for consistency
		course: data.Course,
		specialization: data.CourseSpecialization,
		dob: data.DOB,
		yearSem: data.YearSem,
		gender: data.Gender,
		courseType: data.CourseType,
		branch: data.Branch,
		officialEmail: data.OfficialMailID.toLowerCase(),
		personalEmail: data.Email.toLowerCase(),
		mobile: data.MobileNO,
		batch: data.Batch,
		abcAccount: data.ABCAccountNo,
		address: data.PAddress.trim().replaceAll(/\s+/g, " "),
		section: data.Section,
	};
}

export async function fetchProfile(cookies: Cookies): Promise<StudentProfile> {
	try {
		const response = await fetchGEU("/Account/GetStudentDetail", cookies, {
			method: "POST",
		});
		const data = await response.json();
		return parseStudentProfile(JSON.parse(data.state)[0]);
	} catch (error) {
		console.error("Error fetching student profile:", error);
		throw error;
	}
}

export async function fetchAvatar(cookies: Cookies): Promise<string | null> {
	try {
		const response = await fetchGEU("/Account/show", cookies, {
			method: "GET",
			headers: {
				"Content-Type": "image/png",
			},
		});

		const bytes = new Uint8Array(await response.arrayBuffer());
		const base64String = Buffer.from(bytes).toString("base64");
		return `data:image/png;base64,${base64String}`;
	} catch (error) {
		console.error("Error fetching student avatar:", error);
		return null;
	}
}
