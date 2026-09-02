type TShowMoreCommentsButtonProps = {
  onClick: () => void;
};

const ShowMoreCommentsButton = ({ onClick }: TShowMoreCommentsButtonProps) => {
  const handleShowMoreButtonCLick = () => onClick();
  return (
    <div className="comments__show-more">
      <button
        className="btn btn--second comments__button"
        type="button"
        onClick={handleShowMoreButtonCLick}
      >
        Показать еще
      </button>
    </div>
  );
};

export default ShowMoreCommentsButton;
