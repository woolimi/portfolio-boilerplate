import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Parse git date output and convert to ISO 8601 format
 * @param stdout - Git command stdout
 * @returns ISO 8601 formatted date string or null if empty
 */
function parseGitDate(stdout: string): string | null {
  const dateString = stdout.trim();
  if (!dateString) {
    return null;
  }
  // Convert to ISO 8601 format
  return new Date(dateString).toISOString();
}

/**
 * Get the first commit date (created date) of a file from Git
 * @param filePath - Relative path to the file from repository root
 * @returns ISO 8601 formatted date string or null if not found
 */
export async function getGitCreatedDate(filePath: string): Promise<string | null> {
  try {
    // Use --reverse to get commits in chronological order, then take the first one
    const { stdout } = await execAsync(
      `git log --follow --reverse --format=%ai --diff-filter=A -- "${filePath}" | head -1`,
    );
    return parseGitDate(stdout);
  } catch (error) {
    // File might not be tracked by git or git command failed
    return null;
  }
}

/**
 * Get the last commit date (updated date) of a file from Git
 * @param filePath - Relative path to the file from repository root
 * @returns ISO 8601 formatted date string or null if not found
 */
export async function getGitUpdatedDate(filePath: string): Promise<string | null> {
  try {
    const { stdout } = await execAsync(`git log -1 --format=%ai -- "${filePath}"`);
    return parseGitDate(stdout);
  } catch (error) {
    // File might not be tracked by git or git command failed
    return null;
  }
}
