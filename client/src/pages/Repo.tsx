import { Form, useParams } from "react-router-dom";
import Button from "../components/Button";
import { Repo as RepoType } from "../types/repoType";
import { useEffect, useState } from "react";
import axiosInstance from "../services/connection";

const Repo = () => {
  const [repo, setRepo] = useState<RepoType>(null);
  const { repoId } = useParams();

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const repo = await axiosInstance.get<RepoType>(`/api/repos/${repoId}`);
        setRepo(repo.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRepo();
  }, []);

  return (
    <div id="repo">
      {repo ? (
        <div>
          <h2 className="font-bold text-2xl pb-4">
            {repo.name}
            <span
              className={`${
                repo.status.label === "private" ? "bg-red-400" : "bg-green-400"
              } rounded px-1 ml-2 text-sm`}
            >
              {repo.status.label}
            </span>
          </h2>

          {repo.url && (
            <p className="pb-4">
              <a target="_blank" href={repo.url}>
                Project URL: {repo.url}
              </a>
            </p>
          )}

          <p>Languages:</p>
          <ul>
            {repo.langs.map((lang) => (
              <li className="list-disc ml-5" key={lang.id}>
                {lang.label}
              </li>
            ))}
          </ul>

          <div className="flex flex-rows gap-4 my-4">
            <Form action="edit">
              <Button variant="secondary" type="submit">
                Edit
              </Button>
            </Form>
            <Form
              method="post"
              action="destroy"
              onSubmit={(event) => {
                if (!confirm("Please confirm you want to delete this repo.")) {
                  event.preventDefault();
                }
              }}
            >
              <Button variant="danger" type="submit">
                Delete
              </Button>
            </Form>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Repo;
