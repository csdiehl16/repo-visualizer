// fetchRepoTree.js
require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs-extra");
const path = require("path");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function parseGitHubUrl(repoUrl) {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)(?:\/|$)/);
  if (!match) throw new Error("Invalid GitHub URL");
  return { owner: match[1], repo: match[2] };
}

async function fetchRepoTree(owner, repo, branch = "main") {
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  };

  const branchInfo = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/branches/${branch}`,
    { headers },
  );
  const branchData = await branchInfo.json();
  const sha = branchData.commit.sha;

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`,
    { headers },
  );
  const data = await res.json();
  return data.tree.filter(
    (item) => item.type === "blob" || item.type === "tree",
  );
}

function buildHierarchy(flatFiles) {
  const root = { name: "/", children: [] };

  for (const file of flatFiles) {
    const parts = file.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const isFile = i === parts.length - 1;

      let child = (current.children || []).find((d) => d.name === name);
      if (!child) {
        child = {
          name,
          type: isFile ? "file" : "directory",
          size: isFile ? file.size || 0 : 0,
          extension: isFile ? name.split(".").pop() : null,
          children: isFile ? undefined : [],
        };
        current.children = current.children || [];
        current.children.push(child);
      }

      if (!isFile) current = child;
    }
  }

  // Optional: calculate folder sizes
  function calcSize(node) {
    if (node.type === "file") return node.size;
    node.size = (node.children || []).reduce((sum, c) => sum + calcSize(c), 0);
    return node.size;
  }

  calcSize(root);
  return root;
}

async function main() {
  const repoUrl = process.argv[2];
  if (!repoUrl) {
    console.error("Usage: node fetchRepoTree.js <github_repo_url>");
    process.exit(1);
  }

  const { owner, repo } = parseGitHubUrl(repoUrl);
  console.log(`Fetching tree for ${owner}/${repo}`);

  const flat = await fetchRepoTree(owner, repo);
  const tree = buildHierarchy(flat);

  await fs.ensureDir(path.join(__dirname, "public"));
  await fs.writeJson(path.join(__dirname, "public/tree.json"), tree, {
    spaces: 2,
  });

  console.log("✔ File tree saved to public/tree.json");
}

main();
