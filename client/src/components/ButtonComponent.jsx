import React from "react"

const ButtonComponent = (text, loadingText, loading, onClickFunction, additionalCss) => {
  return (
    <button
      className={
        `bg-accentOrange text-white rounded-lg h-10 hover:bg-accentBlue transition duration-500 ease-in-out ${
          loading ? "opacity-50" : "opacity-100"
        }` + additionalCss
      }
      disabled={loading}
      onClick={onClickFunction}
    >
      {loading ? (
        <>
          <Spinner size="sm" />
          <span className="ml-2">{loadingText}</span>
        </>
      ) : (
        { text }
      )}
    </button>
  )
}

export default ButtonComponent
