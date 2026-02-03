import { atom, useAtom } from "jotai";

const statusAtom = atom<string>();

export const useStatus = () => {
  const [status, setStatus] = useAtom(statusAtom);

  function clearStatus() {
    setStatus("");
  }

  return {
    status,
    setStatus,
    clearStatus,
  };
};

export default useStatus;
