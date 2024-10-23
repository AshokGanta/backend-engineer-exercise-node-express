-- CreateTable
CREATE TABLE "Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "leave_start_date" DATETIME NOT NULL,
    "leave_end_date" DATETIME NOT NULL
);
