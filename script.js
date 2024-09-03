new Vue({
  el: "#app",
  data: {
    courses: [
      {
        name: "Development",
        category: "Software Engineer",
        instructor: "Wisarut",
        days: "2",
      },
      {
        name: "Data Science",
        category: "Data Analyst",
        instructor: "Ariya",
        days: "3",
      },
      {
        name: "Web Design",
        category: "Frontend Developer",
        instructor: "Napat",
        days: "4",
      },
      {
        name: "Machine Learning",
        category: "AI Specialist",
        instructor: "Somsak",
        days: "5",
      },
      {
        name: "Cyber Security",
        category: "Security Analyst",
        instructor: "Pimchan",
        days: "3",
      },
      {
        name: "Mobile App Development",
        category: "iOS Developer",
        instructor: "Kanya",
        days: "4",
      },
      {
        name: "Cloud Computing",
        category: "Cloud Architect",
        instructor: "Chaiya",
        days: "5",
      },
      {
        name: "UI/UX Design",
        category: "Designer",
        instructor: "Mali",
        days: "2",
      },
      {
        name: "Database Management",
        category: "Database Administrator",
        instructor: "Siri",
        days: "3",
      },
      {
        name: "DevOps Engineering",
        category: "DevOps Engineer",
        instructor: "Ananda",
        days: "4",
      },
    ], // เก็บข้อมูลหลักสูตรทั้งหมด
    course: {
      name: "Development",
      category: "Software Engineer",
      instructor: "Wisarut",
      days: "2",
    },
    editIndex: -1, // เก็บดัชนีของหลักสูตรที่กำลังแก้ไข
    ifDisValue: false,
    disValue: "none",
    limit: 5,
    page: 1,
    listSearch: [],
    textSearch: "",
  },
  computed: {
    index() {
      return this.courses.length;
    },
    totalPage() {
      if (this.index == 0) {
        return 1;
      }
      if(this.listSearch != ""){
        return Math.ceil(this.listSearch.length / this.limit);
      }
      return Math.ceil(this.courses.length / this.limit);
    },
    // filteredCourses() {
    //     // Filter courses based on the search query
    //     this.listSearch = this.courses.filter(course => {
    //         const searchVal = this.textSearch.toLowerCase();
    //         return course.name.toLowerCase().includes(searchVal) ||
    //                course.category.toLowerCase().includes(searchVal) ||
    //                course.instructor.toLowerCase().includes(searchVal);
    //     });

    //     return this.listSearch;
    // },
    paginatedCourses() {
        const startIndex = (this.page - 1) * this.limit;
        if(this.listSearch == ""){
            return this.courses.slice(startIndex, startIndex + this.limit);
        }else{
            return this.listSearch.slice(startIndex, startIndex + this.limit);
        }
    },
  },
  methods: {
    popupDis() {
      this.isDisValue = !this.isDisValue;
      if (this.isDisValue == true) {
        this.disValue = "block";
      } else {
        this.disValue = "none";
      }
    },
    submitForm() {
      let message = "";
      let icon = "";
      if (this.editIndex === -1) {
        // เพิ่มหลักสูตรใหม่
        this.courses.push({ ...this.course });
        message = "Added course successfully!";
      } else {
        // อัปเดตหลักสูตรที่เลือก
        Vue.set(this.courses, this.editIndex, { ...this.course });
        message = "Updated course successfully!";
      }
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: message,
      });
      this.resetForm();
      this.popupDis();
    },
    editCourse(index) {
      // เตรียมข้อมูลสำหรับแก้ไข
      this.course = { ...this.courses[index] };
      this.editIndex = index;
    },
    deleteCourse(index) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          // ลบหลักสูตร
          this.courses.splice(index, 1);
          if (this.editIndex === index) {
            this.resetForm();
          }
        }
      });
    },
    selectCourse(index) {
      // แสดงข้อมูลหลักสูตรที่เลือกในฟอร์ม
      this.course = { ...this.courses[index] };
      this.editIndex = index;
    },
    resetForm() {
      // รีเซ็ตฟอร์ม
      this.course = {
        name: "",
        category: "",
        instructor: "",
        days: "",
      };
      this.editIndex = -1;
    },
    formPage() {
      for (let key of this.courses) {
        this.index += 1;
      }
    },
    changePage(pageNumber) {
      this.page = pageNumber;
    },
    nextPage(pageNumber) {
      if (this.page < this.totalPage) {
        this.page += pageNumber;
      }
      return null;
    },
    previousPage(pageNumber) {
      if (this.page > 1) {
        this.page -= pageNumber;
      }
      return null;
    },
    exportPDF() {
      const unit = "pt";
      const size = "A4"; // ใช้ A3, A4, A5 ฯลฯ
      const orientation = "portrait"; // portrait หรือ landscape
      const marginLeft = 40;

      // New PDF instance
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF(orientation, unit, size);
      // Set font
      doc.setFont("Kanit-Regular");
      // ตั้งค่าขนาดฟอนต์
      doc.setFontSize(14);
      // ตั้งค่าชื่อเอกสารพร้อมวันที่
      const title = `In-house Training`;

      // ตั้งค่าหัวตาราง
      const headers = [
        ["NO.", "Course Name", "Category", "Instructor", "Days"],
      ];

      let listCourses = "";
      if(this.listSearch != ""){
        listCourses = this.listSearch;
      }else{
        listCourses = this.courses;
      }

      console.log(listCourses)

      // ตั้งค่าข้อมูลในตาราง
      const data = listCourses.map((course, index) => [
        index + 1,
        course.name,
        course.category,
        course.instructor,
        course.days,
      ]);
      // ตั้งค่าตาราง
      doc.autoTable({
        head: headers,
        body: data,
        startY: 60,
        theme: "grid",
        margin: { top: 60, right: 40, bottom: 20, left: 40 },
        styles: { fontSize: 10, cellPadding: 5 }, // ขนาดฟอนต์และ padding ของเซลล์
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: "auto" },
          2: { cellWidth: 100 },
          3: { cellWidth: 80 },
          4: { cellWidth: 40 },
        },
      });
      // ตั้งค่าชื่อเอกสาร
      doc.text(title, marginLeft, 40);
      // ตั้งค่าหมายเลขหน้า
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.text(`Page ${i} of ${totalPages}`, 500, 800);
      }
      // ชื่อไฟล์ PDF พร้อมวันเวลาที่สร้าง
      const pdfName = `In-house-Training-${new Date().toISOString()}.pdf`;
      // บันทึกไฟล์ PDF
      doc.save(pdfName);
    },
    // search(event){
    //     this.textSearch = event.target.value;
    // },
    filteredCourses(text) {
        // Filter courses based on the search query
        this.listSearch = this.courses.filter(course => {
            const searchVal = text.target.value.toLowerCase();
            return course.name.toLowerCase().includes(searchVal) ||
                   course.category.toLowerCase().includes(searchVal) ||
                   course.instructor.toLowerCase().includes(searchVal);
        });
        console.log(this.listSearch)
        return this.listSearch;
    },
 },
    // watch: {
    //     search() {
    //     this.page = 1;
    //     }
    // },
});
