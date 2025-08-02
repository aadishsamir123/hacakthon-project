// School notice board service
export const getSchoolNotices = () => {
  return [
    {
      id: 1,
      title: "🎓 Midterm Exams Schedule",
      content:
        "Midterm exams will be held from March 15-22. Please check your individual schedules on the student portal.",
      date: "2025-02-28",
      priority: "high",
      author: "Academic Office",
    },
    {
      id: 2,
      title: "🏫 School Library Hours Extended",
      content:
        "Library will now be open until 8 PM on weekdays to support student studies during exam period.",
      date: "2025-03-01",
      priority: "medium",
      author: "Library Staff",
    },
    {
      id: 3,
      title: "🎭 Drama Club Auditions",
      content:
        "Auditions for the spring play 'Romeo and Juliet' will be held March 10-12 in the main auditorium.",
      date: "2025-03-05",
      priority: "low",
      author: "Drama Club",
    },
    {
      id: 4,
      title: "🚌 Bus Route Changes",
      content:
        "Route 7 will have temporary changes due to construction on Main Street. Check updated schedules.",
      date: "2025-03-08",
      priority: "high",
      author: "Transportation Dept",
    },
    {
      id: 5,
      title: "🍕 Pizza Day Fundraiser",
      content:
        "Support the student council! Pizza lunch available every Friday this month for $3.",
      date: "2025-03-01",
      priority: "low",
      author: "Student Council",
    },
    {
      id: 6,
      title: "💻 Computer Lab Maintenance",
      content:
        "Computer Lab B will be closed for maintenance on March 12-13. Please use Lab A or C.",
      date: "2025-03-10",
      priority: "medium",
      author: "IT Department",
    },
    {
      id: 7,
      title: "🏃‍♂️ Track and Field Tryouts",
      content:
        "Spring track and field tryouts begin March 20. Meet at the track after school.",
      date: "2025-03-15",
      priority: "low",
      author: "Athletics Department",
    },
    {
      id: 8,
      title: "📚 Career Fair",
      content:
        "Annual career fair on March 25 in the gymnasium. Over 30 employers will be present.",
      date: "2025-03-20",
      priority: "high",
      author: "Guidance Office",
    },
  ];
};

export const getNoticesByPriority = (priority) => {
  return getSchoolNotices().filter((notice) => notice.priority === priority);
};

export const getRecentNotices = (days = 7) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return getSchoolNotices().filter((notice) => {
    const noticeDate = new Date(notice.date);
    return noticeDate >= cutoffDate;
  });
};

export const getUpcomingNotices = (days = 7) => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  return getSchoolNotices().filter((notice) => {
    const noticeDate = new Date(notice.date);
    return noticeDate >= today && noticeDate <= futureDate;
  });
};
