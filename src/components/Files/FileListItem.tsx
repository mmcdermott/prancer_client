import React, { MouseEvent } from 'react'

interface FileListItemProps {
  file: string
  useHistory: any
}

const FileListItem: React.SFC<FileListItemProps> = props => {
  let history = props.useHistory();
  const { file } = props;

  function onClick(e: MouseEvent) {
    e.preventDefault()
    history.push(`/annotation/${file}`)
  }

  return (
    <div className="file-item" onClick={(e) => onClick(e)}>
      <div className="file-title" key={file}>
        {file}
      </div>
    </div>
  )
}

export default FileListItem
