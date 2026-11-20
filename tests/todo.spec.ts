import { expect, test } from "@playwright/test";

test("adds, lists, validates, orders, and persists todos", async ({ page }) => {
  await page.goto("/");

  const input = page.getByRole("textbox", { name: "새 할 일" });
  const list = page.getByRole("list", { name: "할 일 목록" });

  await input.fill("  장보기  ");
  await page.getByRole("button", { name: "추가" }).click();
  await expect(list.getByRole("listitem")).toHaveText(["장보기"]);

  await input.fill("장보기");
  await page.getByRole("button", { name: "추가" }).click();
  await expect(list.getByRole("listitem")).toHaveText(["장보기", "장보기"]);

  await input.fill("책 읽기");
  await page.getByRole("button", { name: "추가" }).click();
  await expect(list.getByRole("listitem")).toHaveText([
    "책 읽기",
    "장보기",
    "장보기",
  ]);

  await input.fill("   ");
  await page.getByRole("button", { name: "추가" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText(
    "할 일 제목을 입력해 주세요.",
  );
  await expect(list.getByRole("listitem")).toHaveCount(3);

  await page.reload();
  await expect(list.getByRole("listitem")).toHaveText([
    "책 읽기",
    "장보기",
    "장보기",
  ]);
});

test("completes, reopens, filters, and persists todos", async ({ page }) => {
  await page.goto("/");

  const title = "검진 예약하기";
  const list = page.getByRole("list", { name: "할 일 목록" });
  const input = page.getByRole("textbox", { name: "새 할 일" });

  await input.fill(title);
  await page.getByRole("button", { name: "추가" }).click();

  const row = list.getByRole("listitem").filter({ hasText: title });
  const checkbox = row.getByRole("checkbox");

  await checkbox.check();
  await expect(checkbox).toBeChecked();
  await expect(row.getByText(title, { exact: true })).toHaveCSS(
    "text-decoration-line",
    "line-through",
  );

  const filters = page.getByRole("group", { name: "상태 필터" });
  await filters.getByRole("button", { name: "진행 중" }).click();
  await expect(row).toHaveCount(0);

  await filters.getByRole("button", { name: "완료" }).click();
  await expect(row).toBeVisible();
  await row.getByRole("checkbox").uncheck();
  await expect(row.getByRole("checkbox")).not.toBeChecked();

  await filters.getByRole("button", { name: "진행 중" }).click();
  await expect(row).toBeVisible();

  await page.reload();
  await filters.getByRole("button", { name: "전체" }).click();
  await expect(list.getByRole("listitem").filter({ hasText: title })).toBeVisible();
});

test("edits and permanently deletes todos after confirmation", async ({ page }) => {
  await page.goto("/");

  const originalTitle = "우편 보내기";
  const updatedTitle = "서류 우편 보내기";
  const list = page.getByRole("list", { name: "할 일 목록" });
  const input = page.getByRole("textbox", { name: "새 할 일" });

  await input.fill(originalTitle);
  await page.getByRole("button", { name: "추가" }).click();

  let row = list.getByRole("listitem").filter({ hasText: originalTitle });
  await row.getByRole("checkbox").check();
  await page
    .getByRole("group", { name: "상태 필터" })
    .getByRole("button", { name: "완료" })
    .click();

  await row.getByRole("button", { name: `수정: ${originalTitle}` }).click();
  const editInput = page.getByRole("textbox", { name: "새 할 일 제목" });
  const editingRow = list.getByRole("listitem").filter({ has: editInput });
  await editInput.fill("   ");
  await editingRow.getByRole("button", { name: "저장" }).click();
  await expect(editingRow.getByRole("alert")).toHaveText(
    "할 일 제목을 입력해 주세요.",
  );
  await expect(editInput).toHaveValue("   ");

  await editInput.fill(updatedTitle);
  await editingRow.getByRole("button", { name: "저장" }).click();
  row = list.getByRole("listitem").filter({ hasText: updatedTitle });
  await expect(row.getByText(updatedTitle, { exact: true })).toBeVisible();

  page.once("dialog", (dialog) => dialog.dismiss());
  await row.getByRole("button", { name: `삭제: ${updatedTitle}` }).click();
  await expect(row).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());
  await row.getByRole("button", { name: `삭제: ${updatedTitle}` }).click();
  await expect(row).toHaveCount(0);

  await page.reload();
  await expect(list.getByText(updatedTitle, { exact: true })).toHaveCount(0);
});
