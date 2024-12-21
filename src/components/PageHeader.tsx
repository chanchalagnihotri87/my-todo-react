const PageHeader: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="row">
      <div className="col">
        <h4>{text}</h4>
      </div>
    </div>
  );
};

export default PageHeader;
