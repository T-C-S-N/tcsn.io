/** @format */

export default function Loading({ isLoading }: { isLoading: boolean }) {
  return (
    <>
      {isLoading && (
        <div className="w-[100%] h-[100%] flex justify-center items-center">
          <div className="max-w-[100%]">
            ...loading
          </div>
        </div>
      )}
    </>
  );

}
